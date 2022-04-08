import { objectType } from "nexus";

export const Message = objectType({
  name: "Message",
  definition(t) {
    t.model.id();
    t.model.edited();
    t.model.content();
    t.model.mentions();
    t.model.DM();
    t.model.dmId();
    t.model.senderId();
    t.model.readBy();
    t.model.parentMessage();
    t.model.parentMessageId();
    t.model.replies();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
