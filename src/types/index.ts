// ─── Machine States ───────────────────────────────────────────────────────────
export type MachineState =
  | 'Operation'
  | 'Waiting'
  | 'Replacement'
  | 'Error'
  | 'Stopped'
  | 'Optional Stop';

// ─── User Roles ────────────────────────────────────────────────────────────────
export type UserRole = 'Operator' | 'Setupist' | 'Manager';

// ─── Machine ──────────────────────────────────────────────────────────────────
export interface Machine {
  id: string;
  name: string;
  state: MachineState;
  stateEnteredAt: number; // epoch ms
  part?: string;
  order?: string;
  operation?: string;
  planned?: number;
  produced?: number;
  operatorName?: string;
  setupistName?: string;
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export type AlertType = 'waiting' | 'error' | 'escalation' | 'assistance';

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  type: AlertType;
  message: string;
  timestamp: number; // epoch ms
  dismissed: boolean;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  role: UserRole;
  assignedMachineIds: string[];
}
