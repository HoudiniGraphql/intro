import { useFragment, graphql } from '$houdini'
import type { SpeciesPreview as SpeciesPreviewFragment } from '$houdini'
import { Sprite } from './Sprite'
import { Display } from './Display'
import { SpeciesPreviewNumber } from './SpeciesPreviewNumber'

export function SpeciesPreview({
	species,
	number,
}: {
	species: SpeciesPreviewFragment
	number: number
}) {
	const data = useFragment(
		species,
		graphql(`
			fragment SpeciesPreview on Species {
				name
				id
				sprites {
					front
				}
			}
		`)
	)

	if (!data) return null

	return (
		<a href={`/${data.id}`} className="no-underline">
			<SpeciesPreviewNumber value={number} />
			<Sprite
				src={data.sprites.front}
				speciesName={data.name}
				className="h-[102px] w-[102px]"
			/>
			<Display>{data.name}</Display>
		</a>
	)
}
