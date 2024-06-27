import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
	base: '/',
	appType: 'spa',
	plugins: [
		vue(),
		vuetify({ autoImport: true }),
	],
	server: {
		open: true,
		hmr: true
	}
});
