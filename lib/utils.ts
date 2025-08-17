import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileName(url: string): string {
  const fileName = url.split('/').pop() || '';

  return (
    fileName
      // Retirer l'extension
      .replace(/\.[^/.]+$/, '')
      // Remplacer tirets et underscores par des espaces
      .replace(/[-_]/g, ' ')
      // Découper en mots
      .split(' ')
      // Mettre la première lettre en majuscule et le reste en minuscule
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Rejoindre les mots par un espace
      .join(' ')
  );
}
