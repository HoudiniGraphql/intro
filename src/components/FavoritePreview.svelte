<script>
    import { graphql, fragment } from '$houdini'
    import { Sprite } from '.'

    export let species

    const data = fragment(graphql`
        fragment FavoritePreview on Species { 
            id 
            name
            sprites { 
                front
            }
        }
    `, species)

</script>

<a href={$data.id}>
    <img src={$data.sprites.front} alt={`${$data.name} sprite`} />
</a>

<style>
    a {
        display: flex;
        flex-direction: column;
    }
</style>

