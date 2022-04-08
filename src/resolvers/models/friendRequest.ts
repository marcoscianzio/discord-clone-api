import { objectType } from "nexus";
import { Context } from "../../context";

export const FriendRequest = objectType({
  name: "FriendRequest",
  definition(t) {
    t.model.id();
    t.model.recipient();
    t.model.recipientId();
    t.model.requestedAt();
    t.model.requester();
    t.model.requesterId();
    t.model.status();
    t.boolean("incoming", {
      resolve: (root, _, _ctx: Context) =>
        root.recipientId === "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
    });
  },
});
