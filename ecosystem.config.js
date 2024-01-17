module.exports = {
  apps: [
    {
      name: 'backend-nest',
      script: 'dist/src/main.js', // Nome do arquivo principal do seu aplicativo
      instances: '-1',
      autorestart: true, // Reiniciar automaticamente em caso de falha
      watch: false, // Não observar arquivos para reinicialização automática
      max_memory_restart: '1G', // Reiniciar em caso de uso excessivo de memória
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
