import data from './data/data.js'
import { createSchema } from 'graphql-yoga'

export const typeDefs = `scalar Map

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
`

// the list of favorites
const favorites = []

export const resolvers = {
	Query: {
		species(_, { id }) {
			return data.species[id - 1]
		},
		async pokemon(_, args) {
			const { connectionFromArray } = await import('../../lib/connections.mjs')

			const connection = connectionFromArray(data.species, args)
			connection.totalCount = data.species.length

			return connection
		},
		favorites() {
			return favorites.map((id) => data.species[id - 1])
		}
	},
	Mutation: {
		toggleFavorite(_, { id }) {
			// if the id is in the list of favorites, remove it
			if (favorites.includes(id)) {
				favorites.splice(favorites.indexOf(id), 1)
			} else {
				favorites.push(id)
			}

			const species = data.species[id - 1]

			// return the species
			return { species }
		}
	},
	Move: {
		type({ type }) {
			return type[0].toUpperCase() + type.slice(1)
		}
	},
	Species: {
		name({ name }) {
			return name.charAt(0).toUpperCase() + name.slice(1)
		},
		types({ types }) {
			return types.map((type) => type.charAt(0).toUpperCase() + type.slice(1))
		},
		favorite({ id }) {
			return favorites.includes(id)
		},
		evolution_chain({ evo_chain }) {
			return evo_chain.map((id) => data.species[id - 1])
		},
		async moves({ moves }, args) {
			const { connectionFromArray } = await import('../../lib/connections.mjs')

			const connection = connectionFromArray(
				moves.map(({ name, ...info }) => ({ ...info, move: data.moves[name] })),
				args
			)
			connection.totalCount = moves.length

			return connection
		}
	}
}

export const schema = createSchema({
	typeDefs,
	resolvers
})
