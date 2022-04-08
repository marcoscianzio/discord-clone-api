import { enumType, extendType, intArg, nonNull, stringArg } from "nexus";
import { Context } from "../../context";

export const sendFriendRequest = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("sendFriendRequest", {
      type: "FriendRequest",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: async (_, { userId }, { req, prisma }: Context) => {
        if (req.session.userId === userId) {
          throw new Error("You can't send friend request to yourself");
        }

        const recipient = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            friends: {
              select: { id: true },
            },
          },
        });

        if (!recipient) {
          throw new Error("User not found");
        }

        recipient.friends.some((friend) => {
          if (friend.id === "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6") {
            // change to cookie
            throw new Error("You are already friends");
          }
        });

        const friendRequestAlreadyPending =
          await prisma.friendRequest.findFirst({
            where: {
              AND: [
                {
                  recipientId: userId,
                  requesterId: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie
                  status: "PENDING",
                },
              ],
            },
          });

        if (friendRequestAlreadyPending) {
          throw new Error("Friend request is already pending");
        }

        if (!recipient) {
          return null;
        }

        return await prisma.friendRequest.create({
          data: {
            requester: {
              connect: {
                id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
              },
            },
            recipient: {
              connect: {
                id: userId,
              },
            },
          },
        });
      },
    });
  },
});

const TypesOfFriendRequestMutation = enumType({
  name: "TypesOfFriendRequestMutation",
  members: ["ACCEPT", "REJECT"],
});

export const rejectOrAcceptFriendRequest = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("rejectOrAcceptFriendRequest", {
      type: "Boolean",
      args: {
        friendRequestId: nonNull(intArg()),
        type: nonNull(TypesOfFriendRequestMutation),
      },
      resolve: async (_, { friendRequestId, type }, { prisma }: Context) => {
        const friendRequest = await prisma.friendRequest.findUnique({
          where: {
            id: friendRequestId,
          },
        });

        if (!friendRequest) {
          throw new Error("Friend request doesn't exist");
        }

        if (friendRequest.status !== "PENDING") {
          throw new Error(
            "This friend request is already accepted or rejected"
          );
        }

        await prisma.friendRequest.update({
          where: {
            id: friendRequestId,
          },
          data: {
            status: type === "ACCEPT" ? "ACCEPTED" : "REJECTED",
          },
        });

        if (type === "ACCEPT") {
          await prisma.user.update({
            where: {
              id: friendRequest.recipientId,
            },
            data: {
              friends: {
                connect: {
                  id: friendRequest.requesterId,
                },
              },
            },
          });

          await prisma.user.update({
            where: {
              id: friendRequest.requesterId,
            },
            data: {
              friends: {
                connect: {
                  id: friendRequest.recipientId,
                },
              },
            },
          });
        }

        return true;
      },
    });
  },
});
