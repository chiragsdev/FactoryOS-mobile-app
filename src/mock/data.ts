import { Machine, User, Alert } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Odiso Math Mallikarjunaswamy',
    role: 'Operator',
    assignedMachineIds: ['M1', 'M2', 'M3'],
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    role: 'Setupist',
    assignedMachineIds: ['M1', 'M2', 'M3', 'M4', 'M5'],
  },
  {
    id: 'u3',
    name: 'James Kowalski',
    role: 'Manager',
    assignedMachineIds: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
  },
];

export const MOCK_MACHINES: Machine[] = [
  {
    id: 'M1',
    name: '24-10 DA-300-2',
    state: 'Waiting',
    stateEnteredAt: Date.now() - 3 * 60 * 1000,
    part: 'BALL 7028-1101-00',
    order: '33822',
    operation: 'OP#2',
    planned: 570,
    produced: 2,
    operatorName: 'Odiso Math Mallikarjunaswamy',
  },
  {
    id: 'M2',
    name: '24-10 DA-300-1',
    state: 'Operation',
    stateEnteredAt: Date.now() - 45 * 60 * 1000,
    part: 'SHAFT 4021-0200-01',
    order: '33810',
    operation: 'OP#1',
    planned: 320,
    produced: 145,
    operatorName: 'Odiso Math Mallikarjunaswamy',
  },
  {
    id: 'M3',
    name: '24-11 CNC5-001',
    state: 'Error',
    stateEnteredAt: Date.now() - 8 * 60 * 1000,
    part: 'GEAR 5030-0010-03',
    order: '33799',
    operation: 'OP#4',
    planned: 200,
    produced: 87,
    operatorName: 'Odiso Math Mallikarjunaswamy',
  },
  {
    id: 'M4',
    name: '24-12 VMC-400',
    state: 'Replacement',
    stateEnteredAt: Date.now() - 2 * 60 * 1000,
    part: 'BUSHING 2011-0050-00',
    order: '33820',
    operation: 'OP#3',
    planned: 450,
    produced: 210,
    operatorName: 'Jake Morrison',
  },
  {
    id: 'M5',
    name: '24-13 TURN-200',
    state: 'Stopped',
    stateEnteredAt: Date.now() - 120 * 60 * 1000,
    part: '-',
    order: '-',
    operation: '-',
    planned: 0,
    produced: 0,
    operatorName: '-',
  },
  {
    id: 'M6',
    name: '24-14 DA-500-1',
    state: 'Optional Stop',
    stateEnteredAt: Date.now() - 15 * 60 * 1000,
    part: 'PIN 1009-0030-02',
    order: '33788',
    operation: 'OP#1',
    planned: 600,
    produced: 430,
    operatorName: 'Maria Lopez',
  },
];

export const generateInitialAlerts = (userId: string): Alert[] => {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return [];

  const now = Date.now();
  const alerts: Alert[] = [];

  if (user.role === 'Operator') {
    alerts.push({
      id: 'a1',
      machineId: 'M1',
      machineName: '24-10 DA-300-2',
      type: 'waiting',
      message: '24-10 DA-300-2 is WAITING. Ready for next operation.',
      timestamp: now - 3 * 60 * 1000,
      dismissed: false,
    });
    alerts.push({
      id: 'a2',
      machineId: 'M3',
      machineName: '24-11 CNC5-001',
      type: 'error',
      message: '🚨 24-11 CNC5-001 ERROR. Malfunction detected.',
      timestamp: now - 8 * 60 * 1000,
      dismissed: false,
    });
  }

  if (user.role === 'Setupist') {
    alerts.push({
      id: 'a3',
      machineId: 'M3',
      machineName: '24-11 CNC5-001',
      type: 'error',
      message: '🚨 24-11 CNC5-001 ERROR. Malfunction detected.',
      timestamp: now - 8 * 60 * 1000,
      dismissed: false,
    });
    alerts.push({
      id: 'a4',
      machineId: 'M2',
      machineName: '24-10 DA-300-1',
      type: 'assistance',
      message: '🛠️ Assistance requested at 24-10 DA-300-1.',
      timestamp: now - 12 * 60 * 1000,
      dismissed: false,
    });
  }

  if (user.role === 'Manager') {
    alerts.push({
      id: 'a5',
      machineId: 'M1',
      machineName: '24-10 DA-300-2',
      type: 'escalation',
      message: '⚠️ Escalation: Machine 24-10 DA-300-2 has been WAITING for 30 minutes.',
      timestamp: now - 10 * 60 * 1000,
      dismissed: false,
    });
  }

  return alerts;
};
