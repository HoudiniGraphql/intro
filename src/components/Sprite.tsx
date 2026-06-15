import { useFragment, graphql } from '$houdini'
import type { SpriteInfo } from '$houdini'

export function Sprite({
	species,
	id,
	className,
}: {
	species: SpriteInfo | null
	id?: string
	className?: string
}) {
	const info = useFragment(
		species,
		graphql(`
			fragment SpriteInfo on Species {
				name
				sprites {
					front
				}
			}
		`)
	)

	if (!info) return null

	return (
		<div id={id} className={`sprite${className ? ` ${className}` : ''}`}>
			<img height="100%" src={info.sprites.front} alt={`${info.name} sprite`} />
		</div>
	)
}
