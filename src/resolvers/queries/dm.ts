import { extendType } from "nexus";
import { Context } from "../../context";

export const myVisibleDMs = extendType({
  type: "Query",
  definition(t) {
    t.list.field("myVisibleDMs", {
      type: "DM",
      resolve: async (_, _args, { prisma }: Context) => {
        return await prisma.user
          .findUnique({
            where: {
              id: "c6a56b5b-f8f3-4b34-8a0b-6bfbc2c860a6", // change to cookie,
            },
          })
          .visibleDM({
            orderBy: {
              lastMessageDate: "desc",
            },
            include: {
              recipients: {
                select: {
                  id: true,
                  status: true,
                  username: true,
                  avatar: true,
                  aboutMe: true,
                },
              },
            },
          });
      },
    });
  },
});
