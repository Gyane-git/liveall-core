import { verifyToken } from "./jwt";

export function getUserFromRequest(req: Request) {
  const authHeader =
    req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.replace(
    "Bearer ",
    ""
  );

  return verifyToken(token);
}