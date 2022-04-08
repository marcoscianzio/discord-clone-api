import bcrypt from "bcrypt";
import { arg, extendType, inputObjectType, nonNull } from "nexus";
import { Context } from "../../context";
import { randomNumber } from "../../utils/randomNumber";

export const registerInput = inputObjectType({
  name: "registerInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("password");
  },
});

export const loginInput = inputObjectType({
  name: "loginInput",
  definition(t) {
    t.nonNull.string("emailOrPhone");
    t.nonNull.string("password");
  },
});

export const auth = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("register", {
      type: "AuthResponse",
      args: {
        values: nonNull(arg({ type: registerInput })),
      },
      resolve: async (_, { values }, { req, prisma }: Context) => {
        const { email, username, password } = values;

        const emailAlreadyExists = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (emailAlreadyExists) {
          return {
            errors: [
              {
                path: "email",
                message: "Email already exists",
              },
            ],
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const discriminator = randomNumber(1000, 10000).toString();

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username,
            discriminator,
          },
        });

        req.session.userId = user.id;

        return { user };
      },
    });
    t.nonNull.field("login", {
      type: "AuthResponse",
      args: {
        values: nonNull(arg({ type: loginInput })),
      },
      resolve: async (_, { values }, { req, prisma }: Context) => {
        const { emailOrPhone, password } = values;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: emailOrPhone }, { telephone: emailOrPhone }],
          },
        });

        if (!user) {
          return {
            errors: [
              {
                path: "emailOrPhone",
                message: "User not found",
              },
            ],
          };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return {
            errors: [
              {
                path: "password",
                message: "Password is incorrect",
              },
            ],
          };
        }

        req.session.userId = user.id;

        return { user };
      },
    });
  },
});
