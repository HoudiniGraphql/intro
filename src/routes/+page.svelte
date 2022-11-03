<!-- src/routes/+page.svelte -->

<script>
    import { graphql } from '$houdini'
    import { Container, Display, Sprite, Panel } from '~/components'

    const info = graphql`
        query SpeciesInfo {
            species(id: 1) {
                name
                flavor_text
                sprites {
                    front
                }
            }
        }
    `
</script>

<Container>
    <Panel slot="left">
		<Display id="species-name">
			{$info.data.species.name}
			<span>no.{$info.data.species.id}</span>
		</Display>
        <Sprite
            id="species-sprite"
            src={$info.data.species.sprites.front}
            speciesName={$info.data.species.name}
        />
        <Display id="species-flavor_text">
            {$info.data.species.flavor_text}
        </Display>
    </Panel>
</Container>
