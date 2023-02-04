<script>
    import { graphql, fragment } from '$houdini'
    import { Sprite } from '.'

    export let species

    const data = fragment(species, graphql(`
        fragment FavoritePreview on Species {
            id
            ...SpriteInfo
        }
    `))

</script>

<a href={$data.id}>
    <Sprite species={$data} transparentBackground />
</a>

<style>
    a {
        display: flex;
        flex-direction: column;
    }
</style>

