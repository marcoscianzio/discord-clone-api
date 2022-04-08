import { mutationType } from "nexus";

export const deleteUser = mutationType({
  definition(t) {
    t.crud.deleteOneUser();
  },
});
