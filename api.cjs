const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const { GraphQLScalarType, Kind } = require('graphql');
const { connectionFromArray } = require('graphql-relay');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const typeDefs = gql`
	scalar DateTime
	type Error {
		message: String!
		code: String!
	}
	type TodoItem {
		id: ID!
		text: String!
		completed: Boolean!
		createdAt: DateTime!
	}
	type Query {
		items(first: Int, after: String, completed: Boolean): TodoItemConnection!
	}
	type Mutation {
		checkItem(item: ID!): UpdateItemOutput!
		uncheckItem(item: ID!): UpdateItemOutput!
		addItem(input: AddItemInput!): AddItemOutput!
		deleteItem(item: ID!): DeleteIemOutput!
	}
	type Subscription {
		itemUpdate(id: ID!): ItemUpdate!
		newItem: ItemUpdate!
	}
	input AddItemInput {
		text: String!
	}
	type AddItemOutput {
		error: Error
		item: TodoItem
	}
	type UpdateItemOutput {
		error: Error
		item: TodoItem
	}
	type DeleteIemOutput {
		error: Error
		itemID: ID
	}
	type ItemUpdate {
		item: TodoItem!
	}
	type PageInfo {
		startCursor: String
		endCursor: String
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
	}
	type TodoItemConnection {
		totalCount: Int!
		pageInfo: PageInfo!
		edges: [TodoItemEdge!]!
	}
	type TodoItemEdge {
		cursor: String
		node: TodoItem
	}
`;

id = items.length;

const resolvers = {
	Query: {
		items: (_, { completed, ...args } = {}) => {
			const filtered = items.filter((item) =>
				typeof completed === 'boolean' ? Boolean(item.completed) === Boolean(completed) : true
			);

			const connection = connectionFromArray(filtered, args);
			connection.totalCount = items.length;

			return connection;
		}
	},
	Mutation: {
		checkItem(_, { item: targetID, ...rest }) {
			// grab the item in question
			const item = items.find(({ id }) => id === targetID);
			if (!item) {
				throw new Error('Could not find item');
			}

			// update the completed value
			item.completed = true;

			return {
				error: null,
				item
			};
		},
		uncheckItem(_, { item: targetID }) {
			// grab the item in question
			const item = items.find(({ id }) => id === targetID);

			// update the completed value
			item.completed = false;

			return {
				error: null,
				item
			};
		},
		deleteItem(_, { item: targetID }) {
			// filter out the item with the matching id
			items = items.filter(({ id }) => id !== targetID);

			return {
				error: null,
				itemID: targetID
			};
		},
		addItem(_, { input: { text } }) {
			const item = {
				text,
				completed: false,
				id: (parseInt(id, 10) + 1).toString(),
				createdAt: new Date()
			};
			id++;
			items.unshift(item);

			return { item, error: null };
		}
	},
	TodoItem: {
		completed: ({ completed }) => Boolean(completed)
	},
	DateTime: new GraphQLScalarType({
		name: 'DateTime',
		description: 'Date custom scalar type',
		serialize(value) {
			return value.getTime();
		},
		parseValue(value) {
			return new Date(value);
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return new Date(parseInt(ast.value, 10));
			}
			return null;
		}
	})
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
});

server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
