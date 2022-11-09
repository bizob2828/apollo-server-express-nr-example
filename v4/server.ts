// Source: https://www.apollographql.com/docs/apollo-server/api/express-middleware
// yarn add @apollo/server express graphql cors body-parser
import {ApolloServer, BaseContext, ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';

import { typeDefs } from './schema';

interface MyContext extends BaseContext {
  token?: String;
}

const app = express();

const httpServer = http.createServer(app);

const newRelicPlugin = createNewRelicPlugin<ApolloServerPlugin>();

const start = async (): Promise<void> => {
  const server = new ApolloServer<MyContext>({
    typeDefs,
    // resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      newRelicPlugin,
    ],
  });

  await server.start();

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

start().catch(console.error)
