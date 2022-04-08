import { objectType } from "nexus";

export const PathError = objectType({
  name: "PathError",
  definition(t) {
    t.nonNull.string("path");
    t.nonNull.string("message");
  },
});
