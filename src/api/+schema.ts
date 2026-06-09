import { createSchema } from 'graphql-yoga'
import data from './data/data.js'
import { connectionFromArray } from '../lib/connections.mjs'

const favorites: number[] = []

export default createSchema({
	typeDefs: /* GraphQL */ `
		scalar Map

		type Query {
			pokemon(first: Int, after: String): SpeciesConnection!
			species(id: Int!): Species
			favorites: [Species!]!
		}

		type Species {
			id: Int!
			name: String!
			flavor_text: String!
			base_stats: Map!
			favorite: Boolean!
			evolution_chain: [Species!]!
			moves(first: Int, after: String): SpeciesMoveConnection!
			types: [Type!]!
			sprites: SpeciesSprites!
		}

		type SpeciesSprites {
			front: String!
			back: String!
		}

		type SpeciesMove {
			learned_at: Int!
			method: String!
			move: Move!
		}

		type Move {
			name: String!
			power: Int
			accuracy: Int
			pp: Int!
			type: Type
		}

		enum Type {
			Grass
			Poison
			Fire
			Flying
			Water
			Bug
			Normal
			Electric
			Ground
			Fairy
			Fighting
			Psychic
			Rock
			Steel
			Ice
			Ghost
			Dragon
		}

		type SpeciesConnection {
			edges: [SpeciesEdge!]!
			pageInfo: PageInfo!
			totalCount: Int!
		}

		type SpeciesEdge {
			cursor: String
			node: Species
		}

		type SpeciesMoveConnection {
			edges: [SpeciesMoveEdge!]!
			pageInfo: PageInfo!
			totalCount: Int!
		}

		type SpeciesMoveEdge {
			cursor: String
			node: SpeciesMove
		}

		type PageInfo {
			endCursor: String
			hasNextPage: Boolean!
			hasPreviousPage: Boolean!
			startCursor: String
		}

		type Mutation {
			toggleFavorite(id: Int!): ToggleFavoriteOutput
		}

		type ToggleFavoriteOutput {
			species: Species
		}

		type Subscription {
			speciesFavoriteToggled: SpeciesFavoriteToggledOutput!
		}

		type SpeciesFavoriteToggledOutput {
			species: Species!
		}
	`,
	resolvers: {
		Query: {
			species(_: unknown, { id }: { id: number }) {
				return data.species[id - 1]
			},
			pokemon(_: unknown, args: Record<string, unknown>) {
				const connection = connectionFromArray(data.species, args) as Record<string, unknown>
				connection.totalCount = data.species.length
				return connection
			},
			favorites() {
				return favorites.map((id) => data.species[id - 1])
			},
		},
		Mutation: {
			toggleFavorite(_: unknown, { id }: { id: number }) {
				if (favorites.includes(id)) {
					favorites.splice(favorites.indexOf(id), 1)
				} else {
					favorites.push(id)
				}
				return { species: data.species[id - 1] }
			},
		},
		Move: {
			type({ type }: { type: string }) {
				return type[0].toUpperCase() + type.slice(1)
			},
		},
		Species: {
			name({ name }: { name: string }) {
				return name.charAt(0).toUpperCase() + name.slice(1)
			},
			types({ types }: { types: string[] }) {
				return types.map((type) => type.charAt(0).toUpperCase() + type.slice(1))
			},
			favorite({ id }: { id: number }) {
				return favorites.includes(id)
			},
			evolution_chain({ evo_chain }: { evo_chain: number[] }) {
				return evo_chain.map((id) => data.species[id - 1])
			},
			moves({ moves }: { moves: Array<{ name: string; [key: string]: unknown }> }, args: Record<string, unknown>) {
				const movesData = data.moves as Record<string, unknown>
				const connection = connectionFromArray(
					moves.map(({ name, ...info }) => ({ ...info, move: movesData[name] })),
					args
				) as Record<string, unknown>
				connection.totalCount = moves.length
				return connection
			},
		},
	},
})
