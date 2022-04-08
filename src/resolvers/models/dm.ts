import { objectType } from "nexus";

export const DM = objectType({
  name: "DM",
  definition(t) {
    t.model.id();
    t.model.type();
    t.model.recipients();
    t.model.visibility();
    t.model.messages();
    t.model.lastMessageDate();
    t.model.createdAt();
  },
});
