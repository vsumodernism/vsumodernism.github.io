import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
	// Чтение файла из filesystem при SSR
	const filePath = join(process.cwd(), 'public/data/art-movements.json')
	return JSON.parse(readFileSync(filePath, 'utf-8'))
})