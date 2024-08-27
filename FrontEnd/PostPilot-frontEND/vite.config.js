import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const { config } = await import('dotenv');
  config(); 

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.FRONTEND_PORT) || 8080,  
      hmr: {
        overlay: false, 
      },
    },
  };
});
