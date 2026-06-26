import { AlertType, MachineState } from '../types';
import { COLORS, STATE_COLORS } from '../constants/theme';

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

export function getAlertColor(type: AlertType): string {
  switch (type) {
    case 'error': return COLORS.error;
    case 'waiting': return COLORS.waiting;
    case 'escalation': return COLORS.optionalStop;
    case 'assistance': return COLORS.replacement;
  }
}

export function getAlertBg(type: AlertType): string {
  switch (type) {
    case 'error': return COLORS.errorBg;
    case 'waiting': return COLORS.waitingBg;
    case 'escalation': return COLORS.escalationBg;
    case 'assistance': return COLORS.assistanceBg;
  }
}

export function getStateColor(state: MachineState): string {
  return STATE_COLORS[state];
}

export function isUrgentState(state: MachineState): boolean {
  return state === 'Error' || state === 'Waiting';
}
