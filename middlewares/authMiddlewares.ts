import { decode, RouterContext } from "../deps.ts";
import User from "../models/User.ts";

export const authMiddleware = async (ctx: RouterContext, next: Function) => {
  const headers = ctx.request.headers;

  const authHeader = headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    return;
  }
  const jwt = authHeader.split(" ")[1];
  if (!jwt) {
    ctx.response.status = 401;
    return;
  }
  const [header, payload, signature] = decode(jwt);
  if (payload) {
    const user = await User.findOne(payload);
    ctx.state.user = user;
    await next();
  } else {
    ctx.response.status = 401;
  }
}