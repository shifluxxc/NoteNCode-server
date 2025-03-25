import { prisma } from "../../lib/db";
import { verifyToken } from "../../lib/auth"; // Middleware for JWT auth

const Query = {
  getNotes: async (_: any, __: any, context: any) => {
    const userId = context.user.userId; // Ensure user is authenticated
    return await prisma.note.findMany({ where: { userId } });
  },

  getNoteById: async (_: any, { id }: { id: string }, context: any) => {
    const userId = verifyToken(context);
    return await prisma.note.findFirst({ where: { id, userId } });
  },
};

const Mutation = {
    createNote: async (
        _: any,
        { title, content, tags }: { title: string; content: string; tags?: string[] },
        context: any
  ) => {
    // console.log(context);   
    const userId = String(context.user.userId); 
    if (!userId)
      {
        throw new Error("no user find in context"); 
          }
        return await prisma.note.create({
          data: {
            title,
            content,
            tags : tags || [], // ✅ Ensure `tags` is always an array
            userId,
          },
        });
      },

  updateNote: async (
    _: any,
    { id, title, content, tags }: { id: string; title?: string; content?: string; tags?: string[] },
    context: any
  ) => {
    const userId = context.user.userId; 

    return await prisma.note.update({
      where: { id, userId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(tags && { tags: { set: tags } }) // ✅ Only update tags if provided
      },
    });
  },

  deleteNote: async (_: any, { id }: { id: string }, context: any) => {
    const userId = context.user.userId ;
    await prisma.note.delete({ where: { id, userId } });
    return true;
  },
};

export const resolvers = { Query, Mutation };
