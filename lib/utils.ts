import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar telefone
export const formatPhone = (value: string) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara baseada no tamanho
  if (numbers.length <= 10) {
    // Formato: (11) 9999-9999
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1}) ${p2}-${p3}`
      if (p2) return `(${p1}) ${p2}`
      if (p1) return `(${p1}`
      return numbers
    })
  } else {
    // Formato: (11) 99999-9999
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1}) ${p2}-${p3}`
      if (p2) return `(${p1}) ${p2}`
      if (p1) return `(${p1}`
      return numbers
    })
  }
}