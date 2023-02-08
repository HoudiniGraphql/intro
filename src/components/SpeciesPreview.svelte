<script>
    import { graphql, fragment } from '$houdini'
    import { Sprite, Display } from '.'
    import Number from './SpeciesPreviewNumber.svelte'

    export let species
    export let number

    const data = fragment(species, graphql`
        fragment SpeciesPreview on Species { 
            name
            id
			sprites { 
				front
			}
        }
    `)
</script>

<a href={$data.id}>
    <Number value={number} />
    <Sprite 
        src={$data.sprites.front}
        speciesName={$data.name} 
        class="preview-sprite" 
    />
    <Display>
        {$data.name}
    </Display>
</a>

<style>
    :global(.preview-sprite) {
        height: 102px;
        width: 102px;
    }
</style>

