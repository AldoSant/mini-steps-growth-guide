
import { differenceInMonths, parseISO } from "date-fns";
import { Baby } from "@/types";

export const getBabyAge = (baby: Baby) => {
  if (!baby) return null;
  
  const birthDate = parseISO(baby.birth_date);
  const now = new Date();
  const ageInMonths = differenceInMonths(now, birthDate);
  
  if (ageInMonths === 0) {
    // Menos de um mês
    const days = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} dias`;
  } else if (ageInMonths < 24) {
    // Menos de 2 anos, mostrar em meses
    return ageInMonths === 1 ? "1 mês" : `${ageInMonths} meses`;
  } else {
    // 2 anos ou mais, mostrar em anos e meses
    const years = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
    
    if (remainingMonths === 0) {
      return years === 1 ? "1 ano" : `${years} anos`;
    } else {
      const yearText = years === 1 ? "1 ano" : `${years} anos`;
      const monthText = remainingMonths === 1 ? "1 mês" : `${remainingMonths} meses`;
      return `${yearText} e ${monthText}`;
    }
  }
};

export const getCurrentAgeInMonths = (baby: Baby | null) => {
  if (!baby) return 0;
  const birthDate = parseISO(baby.birth_date);
  return differenceInMonths(new Date(), birthDate);
};
