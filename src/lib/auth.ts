import jwt from "jsonwebtoken";


export const verifyToken = (context: any) => {
  const token = context.req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Authentication required.");
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    return decoded.userId; // Return authenticated user's ID
  } catch {
    throw new Error("Invalid token.");
  }
};
