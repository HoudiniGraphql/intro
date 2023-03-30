import fetch from 'node-fetch'
import fs from 'fs/promises'

// load the move data first so we can filter non-gen 1 moves out
const moveData = await (
	await fetch('https://beta.pokeapi.co/graphql/v1beta', {
		method: 'POST',
		body: JSON.stringify({
			query: `
            {
                moves: pokemon_v2_move(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}) {
                    accuracy
                    pp
                    power
                    name
                    name_en: pokemon_v2_movenames(where:{ language_id: {_eq: 9}}) {
                      value: name
                    }
                    pokemon_v2_type {
                      name
                    }
                }
            }
        `
		})
	})
).json()

const moves = moveData.data.moves.reduce(
	(acc, move) => ({
		...acc,
		[move.name]: {
			accuracy: move.accuracy,
			pp: move.pp,
			power: move.power,
			name: move.name_en[0].value,
			type: move.pokemon_v2_type.name
		}
	}),
	{}
)

const {
	data: { pokemon: species }
} = await (
	await fetch('https://beta.pokeapi.co/graphql/v1beta', {
		method: 'POST',
		body: JSON.stringify({
			query: `
            query samplePokeAPIquery {
                pokemon: pokemon_v2_pokemonspecies(order_by: {id: asc}, where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}) {
                    name
                    id
                    evo_chain: pokemon_v2_evolutionchain {
                        species: pokemon_v2_pokemonspecies {
                            id
                        }
                    }
                    flavor_texts: pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}, version_id: {_eq: 3}}, distinct_on: flavor_text) {
                        text: flavor_text
                    }
                }
            }
        `
		})
	})
).json()

// load the extra info we need not present in the gql query
await Promise.all(
	species.map(async (pokemon) => {
		const data = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)).json()

		// condense the graphql response
		pokemon.flavor_text = pokemon.flavor_texts.map(({ text }) =>
			text.replace(/\n/g, ' ').replace(/\f/g, ' ')
		)[0]
		pokemon.evo_chain = pokemon.evo_chain.species.map(({ id }) => id).filter((id) => id <= 151)

		// add the list of types
		pokemon.types = data.types.map(({ type }) => type.name)

		// add the sprites
		pokemon.sprites = {
			front: data.sprites.front_default,
			back: data.sprites.back_default
		}

		const speciesMoves = data.moves.map(({ move, version_group_details }) => {
			const details = version_group_details[0]

			return {
				learned_at: details.level_learned_at,
				method: details.move_learn_method.name,
				name: move.name
			}
		})

		// first sort the moves by level learned
		speciesMoves.sort((moveA, moveB) => {
			return moveA.learned_at > moveB.learned_at ? 1 : -1
		})

		// group the moves by the method
		const moveGroups = speciesMoves.reduce(
			(acc, move) => ({
				...acc,
				[move.method]: [...(acc[move.method] || []), move]
			}),
			{}
		)

		// order the moves
		pokemon.moves = [
			...moveGroups['level-up'],
			...(moveGroups['machine'] || []),
			...(moveGroups['egg'] || [])
		].filter((move) => moves[move.name])

		// merge the base stats into a single object
		pokemon.base_stats = data.stats.reduce(
			(acc, stat) => ({
				...acc,
				[stat.stat.name]: stat.base_stat
			}),
			{}
		)

		// clean up the values we aren't using
		delete pokemon.flavor_texts
	})
)

await fs.writeFile('./data/data.json', JSON.stringify({ species, moves }), 'utf-8')
