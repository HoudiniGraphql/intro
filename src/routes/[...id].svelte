
<script>
    import { Container, Display, Sprite } from '~/components'
    import { query, graphql } from '$houdini'

    const { data } = query(graphql`
        query SpeciesInfo($id: Int!) {
            species(id: $id) {
                name
                flavor_text
                sprites {
                    front
                    back
                }
            }
        }
    `)
</script>

<script context="module">
    export function SpeciesInfoVariables({ params }) {
        // if we were given an id, convert the string to a number
        const id = params.id ? parseInt(params.id) : 1

        // check that the id falls between 1 and 151
        if (id < 1 || id > 151) {
            return this.error(400, 'id must be between 1 and 151')
        }

        return {
            id
        }
    }
</script>

<Container>
    <div slot="left">
        <Display id="species-display">
            {$data.species.name}
        </Display>
        <Sprite
            id="species-sprite"
            src={$data.species.sprites.front}
            speciesName={$data.species.name}
        />
        <Display id="species-flavor_text">
            {$data.species.flavor_text}
        </Display>
    </div>
    <div slot="right">
        <nav>
            <a href={`/${$data.species.id-1}`} disabled={ $data.species.id <= 1} >
                previous
            </a>
            <a href={`/${$data.species.id+1}`} disabled={$data.species.id >= 151}>
                next
            </a> 
        </nav>
    </div>
</Container>