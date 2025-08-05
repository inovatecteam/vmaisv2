// types/global.d.ts
// Este arquivo é destinado a declarar tipos globais para o projeto.
// NÃO adicione instruções 'import' ou 'export' no nível superior,
// pois isso transformaria este arquivo em um módulo e impediria que suas declarações
// fossem automaticamente globais.

declare global {
  interface Window {
    google: any; // Representa o objeto global Google
    initMap: () => void; // Se initMap também for global
  }

  // Declare a variável global 'google' diretamente aqui
  const google: typeof window.google;
}

// Esta instrução de exportação vazia faz com que o arquivo seja um módulo, o que é frequentemente necessário
// para que 'declare global' seja processado corretamente em projetos baseados em módulos.
export {};