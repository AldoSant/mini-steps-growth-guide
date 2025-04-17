import { differenceInMonths, format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Baby } from '@/types';

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

export function formatDistance(input: string | number | Date): string {
  const date = new Date(input);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
}

export function getBabyAge(baby: Baby): string {
  const birthDate = new Date(baby.birth_date);
  const today = new Date();
  
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  let ageString = '';

  if (years > 0) {
    ageString += `${years} ano${years > 1 ? 's' : ''}`;
    if (months < 0) {
      ageString = `Faltam ${12 + months} meses para ${years} ano${years > 1 ? 's' : ''}`
    } else if (months > 0) {
      ageString += ` e ${months} mese${months > 1 ? 's' : ''}`;
    }
  } else if (months > 0) {
    ageString += `${months} mese${months > 1 ? 's' : ''}`;
    if (days < 0) {
      ageString = `Faltam ${new Date(today.getFullYear(), today.getMonth() - 1, 0).getDate() + days} dias para ${months} mese${months > 1 ? 's' : ''}`
    }
  } else if (days >= 0) {
    ageString += 'alguns dias';
  } else {
    ageString = 'poucos dias';
  }

  return ageString;
}

export function getCurrentAgeInMonths(baby: Baby | null): number {
  if (!baby) return 0;
  const birthDate = new Date(baby.birth_date);
  const today = new Date();
  return differenceInMonths(today, birthDate);
}

export function getAgeRangeText(minAge: number, maxAge: number): string {
  if (minAge === maxAge) {
    return `${minAge} ${minAge === 1 ? 'mês' : 'meses'}`;
  }
  
  if (maxAge === 999 || maxAge === Infinity) {
    return `${minAge}+ meses`;
  }
  
  return `${minAge}-${maxAge} meses`;
}
