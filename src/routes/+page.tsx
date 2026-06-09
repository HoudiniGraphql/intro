import { Container, Display, Sprite, Panel } from '~/components'
import type { PageProps } from './$types'

export default function Page({ Info }: PageProps) {
	return (
		<Container>
			<Panel side="left">
				<Display id="species-name">
					{Info.species.name}
					<span>no.{Info.species.id}</span>
				</Display>
				<Sprite
					id="species-sprite"
					src={Info.species.sprites.front}
					speciesName={Info.species.name}
				/>
				<Display id="species-flavor_text">{Info.species.flavor_text}</Display>
			</Panel>
		</Container>
	)
}
