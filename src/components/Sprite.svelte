<script lang="ts">
    import { fragment, graphql } from '$houdini'
    import type { SprintInfo } from '$houdini'

    export let species: SprintInfo

    $: info = fragment(species, graphql(`
        fragment SpriteInfo on Species {
            name
            sprites {
                front
            }
        }
    `))
</script>

<div id={$$props.id} class="sprite">
    <img
        src={$info.sprites.front}
        alt={`${$info.name} sprite`}
        height="100%"
    />
</div>
