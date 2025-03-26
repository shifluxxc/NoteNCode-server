import { prisma } from "../../lib/db";

const Query = {
  getNotes: async (_: any, __: any, context: any) => {
    const userId = context.user.userId; // Ensure user is authenticated
    return await prisma.note.findMany({ where: { userId } });
  },

  getNoteById: async (_: any, { id }: { id: string }, context: any) => {
    const userId = context.user.userId ; 
    return await prisma.note.findFirst({ where: { id, userId } });
  },

  getProblemIdByTag: async (_: any, { tag }: { tag: string }) => {
    const problemTags = await prisma.problemTag.findMany({
      where: { tag: { name: tag } },
      select: { problemId: true },
    });
  
    return problemTags.map((entry) => entry.problemId); // Convert to a list of strings
  }
  ,
  getTagsByProblemId: async (_: any, { problemId }: { problemId: string }) => {
    const tags = await prisma.problemTag.findMany({
      where: { problemId },
      select: { tag: { select: { name: true } } }, // Select only the tag name
    });
  
    return tags.map((entry) => entry.tag.name);
  }, 
  getNotesByProblem: async (_: any, { problemId }: { problemId: string }) => {
    return await prisma.note.findMany({
      where: { problemId },
      include: { user: true },
    });
  },
};

const Mutation = {
  addNote: async (_: any, { problemId, content }: { problemId: string; content: string }, context: any) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const newNote = await prisma.note.create({
      data: {
        userId: context.user.userId, // Ensure the user is associated
        problemId,
        content,
      },
      include: {
        user: true, // Include user details // Include problem details
      },
    });

    return newNote;
  },
  addTag: async (_: any, { problemId, tagName }: { problemId: string; tagName: string }) => {
    // Find the tag, create it if it doesn't exist
    let tag = await prisma.tag.findUnique({ where: { name: tagName } });
    if (!tag) tag = await prisma.tag.create({ data: { name: tagName } });
  
    // Check if the problem-tag relationship already exists
    const existingProblemTag = await prisma.problemTag.findUnique({
      where: { problemId_tagId: { problemId, tagId: tag.id } },
    });
  
    if (existingProblemTag) {
      throw new Error(`Tag "${tagName}" is already associated with problem ${problemId}`);
    }
  
    // Create the problem-tag relationship
    return await prisma.problemTag.create({
      data: { problemId, tagId: tag.id },
    });
  }
  ,
  deleteNote: async (_: any, { id}: { id : string }) => {
    try {
      await prisma.note.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }
};

export const resolvers = { Query, Mutation };
