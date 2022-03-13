<script>
    import { Display } from '.'
    import { fragment, graphql } from '$houdini'

    export let move

    const data = fragment(graphql`
        fragment MoveDisplay on SpeciesMove {
            learned_at
            move { 
                name
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

    h2 { 
        font-weight: normal;
        text-shadow: #e78181 -1px 1px;
    }

    h3 { 
        margin: 0;
        font-weight: normal;
        font-size: 24px;
        text-decoration: underline;
    }
    
</style>