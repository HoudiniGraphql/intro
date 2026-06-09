import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import adapter from 'houdini-adapter-auto'
import houdini from 'houdini/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [houdini({ adapter }), tailwindcss(), react()],
})
