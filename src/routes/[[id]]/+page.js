import { error } from '@sveltejs/kit'

export function load({ params }) {
	const id = params.id ? parseInt(params.id) : 1

	if (id < 1 || id > 151) {
		throw error(400, 'id must be between 1 and 151')
	}

	return { id }
}
