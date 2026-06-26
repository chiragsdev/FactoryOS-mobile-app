import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { User, Machine, Alert, MachineState } from '../types';
import { MOCK_MACHINES, MOCK_USERS, generateInitialAlerts } from '../mock/data';

interface AppContextType {
  user: User | null;
  machines: Machine[];
  alerts: Alert[];
  unreadCount: number;
  login: (userId: string) => void;
  logout: () => void;
  dismissAlert: (alertId: string) => void;
  dismissAll: () => void;
  simulateStateChange: (machineId: string, newState: MachineState) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertIdCounter = useRef(100);

  const login = useCallback((userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setUser(found);
      setAlerts(generateInitialAlerts(userId));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAlerts([]);
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  }, []);

  const dismissAll = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
  }, []);

  const addAlert = useCallback(
    (partial: Omit<Alert, 'id' | 'timestamp' | 'dismissed'>) => {
      if (!user) return;
      // Only add alerts relevant to this user's role
      const id = `alert_${++alertIdCounter.current}`;
      setAlerts(prev => [
        { ...partial, id, timestamp: Date.now(), dismissed: false },
        ...prev,
      ]);
    },
    [user]
  );

  const simulateStateChange = useCallback(
    (machineId: string, newState: MachineState) => {
      setMachines(prev =>
        prev.map(m =>
          m.id === machineId
            ? { ...m, state: newState, stateEnteredAt: Date.now() }
            : m
        )
      );
      if (!user) return;
      const machine = machines.find(m => m.id === machineId);
      if (!machine) return;

      if (newState === 'Waiting' && user.role === 'Operator') {
        addAlert({
          machineId,
          machineName: machine.name,
          type: 'waiting',
          message: `${machine.name} is WAITING. Ready for next operation.`,
        });
      }
      if (newState === 'Error') {
        if (user.role === 'Operator' || user.role === 'Setupist') {
          addAlert({
            machineId,
            machineName: machine.name,
            type: 'error',
            message: `🚨 ${machine.name} ERROR. Malfunction detected.`,
          });
        }
      }
    },
    [user, machines, addAlert]
  );

  // Manager escalation: check every 30 seconds if any Waiting machine > 20 min
  useEffect(() => {
    if (!user || user.role !== 'Manager') return;
    const interval = setInterval(() => {
      const now = Date.now();
      machines.forEach(m => {
        if (m.state === 'Waiting') {
          const waitMinutes = (now - m.stateEnteredAt) / 60000;
          if (waitMinutes >= 20) {
            // Check if we haven't already escalated this machine recently
            const alreadyEscalated = alerts.some(
              a =>
                a.machineId === m.id &&
                a.type === 'escalation' &&
                !a.dismissed &&
                now - a.timestamp < 10 * 60 * 1000
            );
            if (!alreadyEscalated) {
              addAlert({
                machineId: m.id,
                machineName: m.name,
                type: 'escalation',
                message: `⚠️ Escalation: Machine ${m.name} has been WAITING for ${Math.round(waitMinutes)} minutes.`,
              });
            }
          }
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [user, machines, alerts, addAlert]);

  const unreadCount = alerts.filter(a => !a.dismissed).length;

  return (
    <AppContext.Provider
      value={{
        user,
        machines,
        alerts,
        unreadCount,
        login,
        logout,
        dismissAlert,
        dismissAll,
        simulateStateChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
