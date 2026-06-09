import { useFragment, graphql } from '$houdini'
import type { FavoritePreview$key } from '$houdini'

export function FavoritePreview({ species }: { species: FavoritePreview$key }) {
	const data = useFragment(
		species,
		graphql(`
			fragment FavoritePreview on Species {
				id
				name
				sprites {
					front
				}
			}
		`)
	)

	return (
		<a href={`/${data.id}`} className="flex flex-col no-underline">
			<img src={data.sprites.front} alt={`${data.name} sprite`} />
		</a>
	)
}
