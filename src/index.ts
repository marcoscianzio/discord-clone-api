import { ApolloServer } from "apollo-server-express";
import express from "express";
import { schema } from "./schema";
import { Context, prisma } from "./context";
// import Redis from "ioredis";
// import connectRedis from "connect-redis";
import { WebSocketServer } from "ws";
import session from "express-session";
import cors from "cors";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

async function main() {
  const app = express();

  // const RedisStore = connectRedis(session);
  // const client = new Redis();

  app.set("trust proxy", true);

  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    })
  );

  app.use(
    session({
      name: "qid",
      // store: new RedisStore({ client, disableTouch: true }),
      cookie: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 100 * 60 * 60 * 24 * 1000,
      },
      saveUninitialized: false,
      secret: "oiteroietrioweuiowqhwqhsdhjksndfnsd",
      resave: false,
    })
  );

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/api",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: Context) => ({ req, res, prisma }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
    cors: false,
  });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log("server listening on port " + PORT);
  });
}

main();
