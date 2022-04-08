import { PubSub, withFilter } from "graphql-subscriptions";
import { mutationField, nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";

export const pubsub = new PubSub();

export const sendMessageSubscription = subscriptionField("sendMessage", {
  type: "Message",
  args: {
    dmId: nonNull(stringArg()), //change to cookie
  },
  subscribe: withFilter(
    () => {
      return pubsub.asyncIterator("MESSAGE_SENT");
    },
    ({ sendMessage }, { dmId }) => {
      return sendMessage.dmId === dmId;
    }
  ),
  resolve: (payload) => {
    return payload.sendMessage;
  },
});

export const sendMessage = mutationField("sendMessage", {
  type: "Message",
  args: {
    content: nonNull(stringArg()),
    dmId: nonNull(stringArg()), // change to nullable
  },
  resolve: async (_, { content, dmId }, { prisma }: Context) => {
    const dm = await prisma.dM.findUnique({
      where: {
        id: dmId,
      },
    });

    if (!dm) {
      throw new Error("DM not found");
    }

    const message = await prisma.message.create({
      data: {
        content,
        sender: {
          connect: {
            id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
          },
        },
        DM: {
          connect: {
            id: dmId,
          },
        },
        readBy: {
          connect: {
            id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
          },
        },
      },
    });

    await prisma.dM.update({
      where: {
        id: dmId,
      },
      data: {
        lastMessageDate: message.createdAt,
      },
    });

    pubsub.publish("MESSAGE_SENT", {
      sendMessage: message,
    });

    return message;
  },
});
