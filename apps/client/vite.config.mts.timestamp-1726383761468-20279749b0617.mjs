// apps/client/vite.config.mts
import { nxCopyAssetsPlugin } from "file:///workspaces/tun-judge/node_modules/@nx/vite/plugins/nx-copy-assets.plugin.js";
import { nxViteTsPaths } from "file:///workspaces/tun-judge/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import react from "file:///workspaces/tun-judge/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///workspaces/tun-judge/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/workspaces/tun-judge/apps/client";
var vite_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: "../../node_modules/.vite/apps/client",
  server: {
    port: 4200,
    host: "localhost",
    proxy: {
      "^/api.*": {
        target: "http://0.0.0.0:3000",
        changeOrigin: true,
        secure: false
      },
      "^/socket.io": {
        target: `ws://localhost:3001/`,
        ws: true
      }
    }
  },
  preview: {
    port: 4300,
    host: "localhost"
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: "../../dist/apps/client",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy9jbGllbnQvdml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtzcGFjZXMvdHVuLWp1ZGdlL2FwcHMvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlcy90dW4tanVkZ2UvYXBwcy9jbGllbnQvdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2VzL3R1bi1qdWRnZS9hcHBzL2NsaWVudC92aXRlLmNvbmZpZy5tdHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz0ndml0ZXN0JyAvPlxuaW1wb3J0IHsgbnhDb3B5QXNzZXRzUGx1Z2luIH0gZnJvbSAnQG54L3ZpdGUvcGx1Z2lucy9ueC1jb3B5LWFzc2V0cy5wbHVnaW4nO1xuaW1wb3J0IHsgbnhWaXRlVHNQYXRocyB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtdHNjb25maWctcGF0aHMucGx1Z2luJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogX19kaXJuYW1lLFxuICBjYWNoZURpcjogJy4uLy4uL25vZGVfbW9kdWxlcy8udml0ZS9hcHBzL2NsaWVudCcsXG5cbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNDIwMCxcbiAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICBwcm94eToge1xuICAgICAgJ14vYXBpLionOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8wLjAuMC4wOjMwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICB9LFxuICAgICAgJ14vc29ja2V0LmlvJzoge1xuICAgICAgICB0YXJnZXQ6IGB3czovL2xvY2FsaG9zdDozMDAxL2AsXG4gICAgICAgIHdzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MzAwLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICB9LFxuXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBueFZpdGVUc1BhdGhzKCksIG54Q29weUFzc2V0c1BsdWdpbihbJyoubWQnXSldLFxuXG4gIC8vIFVuY29tbWVudCB0aGlzIGlmIHlvdSBhcmUgdXNpbmcgd29ya2Vycy5cbiAgLy8gd29ya2VyOiB7XG4gIC8vICBwbHVnaW5zOiBbIG54Vml0ZVRzUGF0aHMoKSBdLFxuICAvLyB9LFxuXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnLi4vLi4vZGlzdC9hcHBzL2NsaWVudCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUywwQkFBMEI7QUFDbkMsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBSjdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFVBQVU7QUFBQSxFQUVWLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBRUEsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT2hFLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLHNCQUFzQjtBQUFBLElBQ3RCLGlCQUFpQjtBQUFBLE1BQ2YseUJBQXlCO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
