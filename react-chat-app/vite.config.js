// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // Load environment variables
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173, // ✅ Ensures frontend runs on 5173 (default for Vite)
//     proxy: {
//       "/api": {
//         target: process.env.VITE_BACKEND_URL || "http://localhost:7070",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ✅ Ensures frontend runs on the correct port locally
  },
});
