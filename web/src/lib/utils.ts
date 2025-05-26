import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toFixed(decimals);
}

export function getColorForPercentage(percentage: number): string {
  if (percentage > 75) return 'bg-green-500';
  if (percentage > 50) return 'bg-yellow-500';
  if (percentage > 25) return 'bg-orange-500';
  return 'bg-red-500';
}

export function sendNuiMessage(action: string, data: any) {
  fetch(`https://hcyk_hud_reworked/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  }).catch(err => console.error('Error sending NUI message:', err));
}
