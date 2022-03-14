<script>
    import { Display } from '.'
    import { fragment, graphql } from '$houdini'

    export let move

    const data = fragment(graphql`
        fragment MoveDisplay on SpeciesMove {
            learned_at
            move { 
                name
                accuracy
                power
                pp
                type
            }
        }
    `, move)
</script>

<Display id="move-display">
    <h3>
        {$data.move.name}
    </h3>
</Display>

<style>
    :global(#move-display) { 
        position: relative;
        padding: 10px 20px;
        height: 80px;
    }


    h3 { 
        margin: 0;
        font-weight: normal;
        font-size: 24px;
        border-bottom: 2px solid black;
        display: inline-flex;
        padding: 0 4px;
    }
</style>