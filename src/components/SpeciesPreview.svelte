<script>
    import { graphql, fragment } from '$houdini'
    import { Sprite, Display } from '.'
    import Number from './SpeciesPreviewNumber.svelte'

    export let species
    export let number

    const data = fragment(graphql`
        fragment SpeciesPreview on Species { 
            name
            id
            ...SpriteInfo
        }
    `, species)
</script>

<a href={$data.id}>
    <Number value={number} />
    <Sprite species={species} />
    <Display>
        {$data.name}
    </Display>
</a>

