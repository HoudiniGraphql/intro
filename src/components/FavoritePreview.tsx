import { useFragment, graphql, Link } from '$houdini'
import type { FavoritePreview as FavoritePreviewFragment } from '$houdini'

export function FavoritePreview({ species }: { species: FavoritePreviewFragment }) {
	const data = useFragment(
		species,
		graphql(`
			fragment FavoritePreview on Species {
				id
				pokedexNumber
				name
				sprites {
					front
				}
			}
		`)
	)

	return (
		<Link to="/[[id]]" params={{ id: data.pokedexNumber }} className="flex flex-col no-underline h-full">
			<img src={data.sprites.front} alt={`${data.name} sprite`} className="h-full w-auto" />
		</Link>
	)
}
