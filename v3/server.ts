// Source: https://www.apollographql.com/docs/apollo-server/api/express-middleware
// yarn add @apollo/server express graphql cors body-parser
import {ApolloServer } from 'apollo-server-express';
import express from 'express'
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';

import { typeDefs } from './schema';

const app = express();

const newRelicPlugin = createNewRelicPlugin();

const start = async (): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    // resolvers,
    plugins: [
      newRelicPlugin,
    ],
  });

  await server.start();
  server.applyMiddleware({ app })

  await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

start().catch(console.error)
