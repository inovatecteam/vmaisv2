/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // /sobre foi absorvida por /impacto. Mantido permanente para não quebrar
      // links antigos (reportagens, buscadores, material impresso).
      { source: '/sobre', destination: '/impacto', permanent: true },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
      };
    } else {
      // Para o build do servidor, ignore essas dependências opcionais
      config.externals = [
        ...config.externals,
        'bufferutil',
        'utf-8-validate',
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
