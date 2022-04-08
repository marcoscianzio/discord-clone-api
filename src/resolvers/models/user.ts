import { objectType } from "nexus";
import { Context } from "../../context";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.discriminator();
    t.model.username();
    t.model.verified();
    t.model.telephone();
    t.model.avatar();
    t.model.status();
    t.model.color();
    t.model.banner();
    t.model.aboutMe();
    t.model.friends();
    t.model.blocked();
    t.boolean("asRequesterPending", {
      resolve: async (root, _, { prisma }: Context) => {
        const request = await prisma.friendRequest.findFirst({
          where: {
            AND: [
              {
                requesterId: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6",
                recipientId: root.id,
                status: "PENDING",
              },
            ],
          },
        });
        console.log("asRequesterPending", request);

        return request ? true : false;
      },
    });
    t.boolean("asRecipientPending", {
      resolve: async (root, _, { prisma }: Context) => {
        const request = await prisma.friendRequest.findFirst({
          where: {
            AND: [
              {
                requesterId: root.id,
                recipientId: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6",
                status: "PENDING",
              },
            ],
          },
        });

        console.log("asRecipientPending", request);

        return request ? true : false;
      },
    });
    t.model.blockedRelation();
    t.model.visibleDM();
    t.model.DM();
    t.model.incomingFriendRequest();
    t.model.outgoingFriendRequest();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const AuthResponse = objectType({
  name: "AuthResponse",
  definition(t) {
    t.nullable.field("user", {
      type: "User",
    });
    t.nullable.list.field("errors", {
      type: "PathError",
    });
  },
});
