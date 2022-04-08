import { extendType } from "nexus";
import { Context } from "../../context";

export const getAllUsers = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      resolve: async (_, _args, { prisma }: Context) => {
        return await prisma.user.findMany();
      },
    });
  },
});

export const me = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("me", {
      type: "User",
      resolve: async (_, _args, { prisma, req }: Context) => {
        if (!req.session.userId) {
          return null;
        }

        return await prisma.user.findUnique({
          where: {
            id: req.session.userId,
          },
          include: {
            friends: true,
            friendsRelation: true,
            incomingFriendRequest: true,
            outgoingFriendRequest: true,
          },
        });
      },
    });
  },
});

export const myFriendRequests = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("myFriendRequests", {
      type: "FriendRequest",
      resolve: async (_, _args, { prisma }: Context) => {
        // if (!req.session.userId) {
        //   return null;
        // } change to cookie

        return await prisma.friendRequest.findMany({
          where: {
            OR: [
              {
                requesterId: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
              },
              {
                recipientId: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
              },
            ],
          },
          orderBy: {
            requestedAt: "desc",
          },
          include: {
            recipient: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            requester: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        });
      },
    });
  },
});

export const onlineFriends = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("onlineFriends", {
      type: "User",
      resolve: async (_, _args, { prisma }: Context) => {
        return await prisma.user
          .findUnique({
            where: {
              id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
            },
          })
          .friends({
            where: {
              status: "ONLINE",
            },
            select: {
              id: true,
              status: true,
              username: true,
              avatar: true,
            },
          });
      },
    });
  },
});

export const allFriends = extendType({
  type: "Query",
  definition(t) {
    t.nullable.list.field("allFriends", {
      type: "User",
      resolve: async (_, _args, { prisma }: Context) => {
        return await prisma.user
          .findUnique({
            where: {
              id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
            },
          })
          .friends({
            select: {
              id: true,
              status: true,
              username: true,
              avatar: true,
            },
          });
      },
    });
  },
});
