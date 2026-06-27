import { error } from '@sveltejs/kit'
import { load_Info } from '$houdini'

export async function load(event) {
	const id = event.params.id ? parseInt(event.params.id) : 1

	if (id < 1 || id > 151) {
		throw error(400, 'id must be between 1 and 151')
	}

	return await load_Info({ event, variables: { id } })
}
