import { ApolloServer } from 'apollo-server-lambda';

import { resolvers } from './frameworks/resolvers';
import { typeDefs } from './frameworks/typeDefs';

export const server = new ApolloServer({ resolvers, typeDefs }).createHandler();
