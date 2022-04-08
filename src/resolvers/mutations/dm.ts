import { list, mutationField, nonNull, stringArg } from "nexus";
import { Context } from "../../context";

export const createDM = mutationField("createDM", {
  type: "DM",
  args: {
    recipientsIds: nonNull(list(nonNull(stringArg()))),
  },
  resolve: async (_, { recipientsIds }, { prisma }: Context) => {
    const recipientsIdsPlusSender = [
      ...recipientsIds,
      "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6",
    ]; // change to cookie;

    const recipients = await prisma.user.findMany({
      where: {
        id: {
          in: recipientsIdsPlusSender,
        },
      },
      select: {
        id: true,
      },
    });

    if (!recipients) {
      throw new Error("Recipients not found");
    }

    const alreadyExistDm = await prisma.dM.findFirst({
      where: {
        recipients: {
          every: {
            id: {
              in: recipientsIdsPlusSender,
            },
          },
        },
      },
    });

    if (alreadyExistDm) {
      throw new Error("DM already exist");
    }

    const type = recipients.length > 2 ? "GROUP" : "ONE_TO_ONE";

    return await prisma.dM.create({
      data: {
        recipients: {
          connect: recipients.map(({ id }) => ({ id })),
        },
        type,
        visibility: {
          connect: recipients.map(({ id }) => ({ id })),
        },
      },
    });
  },
});

export const toggleDMVisibility = mutationField("toggleDMVisibility", {
  type: "DM",
  args: {
    dmId: nonNull(stringArg()),
  },
  resolve: async (_, { dmId }, { prisma }: Context) => {
    const dm = await prisma.dM.findUnique({
      where: {
        id: dmId,
      },
      select: {
        visibility: {
          select: { id: true },
        },
      },
    });

    if (!dm) {
      throw new Error("DM not found");
    }

    const checkVisibility = (obj: { id: string }) =>
      obj.id === "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6"; // change to cookie;

    if (dm.visibility.some(checkVisibility)) {
      return await prisma.dM.update({
        where: {
          id: dmId,
        },
        data: {
          visibility: {
            disconnect: {
              id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie;
            },
          },
        },
      });
    }

    return await prisma.dM.update({
      where: {
        id: dmId,
      },
      data: {
        visibility: {
          connect: {
            id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie
          },
        },
      },
    });
  },
});
