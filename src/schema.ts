import { makeSchema } from "nexus";
import { nexusPrisma } from "nexus-plugin-prisma";
import { join } from "path";
import * as types from "./resolvers";

export const schema = makeSchema({
  types,
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    typegen: join(__dirname, "../node_modules/@types/nexus-typegen/index.d.ts"),
    schema: join(__dirname, "..", "schema.graphql"),
  },
});
