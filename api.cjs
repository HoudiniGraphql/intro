const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const { connectionFromArray } = require('graphql-relay');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { readFile } = require('fs/promises');

// load the data file before we do anything
let data;

const typeDefs = gql`
	scalar Map

	type Query {
		pokemon(first: Int, after: String): SpeciesConnection!
		species(id: Int!): Species
	}

	type Species {
		id: Int!
		name: String!
		flavor_text: String!
		stats: Map!
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
		power: Int!
		accuracy: Int!
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
`;

const resolvers = {
	Query: {
		species(_, { id }) {
			return data.species[id - 1];
		},
		pokemon(_, args) {
			const connection = connectionFromArray(data.species, args);
			connection.totalCount = data.species.length;

			return connection;
		}
	},
	Species: {
		name: ({ name }) => {
			return name.charAt(0).toUpperCase() + name.slice(1);
		},
		types: ({ types }) => {
			return types.map((type) => type.charAt(0).toUpperCase() + type.slice(1));
		},
		evolution_chain: ({ evo_chain }) => evo_chain.map((id) => data.species[id - 1]),
		moves({ moves }, args) {
			const connection = connectionFromArray(
				moves.map(({ name, ...info }) => ({ ...info, move: data.moves[name] })),
				args
			);
			connection.totalCount = moves.length;

			return connection;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

readFile('./data/data.json', 'utf-8')
	.then((result) => (data = JSON.parse(result)))
	.then(() => {
		server.listen().then(({ url }) => {
			console.log(`🚀  Server ready at ${url}`);
		});
	});
