import { getNumericDate } from "https://deno.land/x/djwt@v2.3/mod.ts";
import {
  compareSync,
  create,
  hashSync,
  RouterContext,
  verify,
} from "../deps.ts";
import User from "../models/User.ts";

class AuthController {
  async login(ctx: RouterContext) {
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { email, password } = value;
      if (!email || !password) {
        ctx.response.status = 422;
        ctx.response.body = {
          message: "Please provide correct email and password",
        };
        return;
      }
      const _user = await User.findOne({ email: email });
      const user = new User(_user.name, _user.email, _user.password);
      user.id = _user.id;
      if (!user) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Incorrect email" };
        return;
      }
      if (!compareSync(password, user.password)) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Incorrect password" };
        return;
      } else {
        const key = await crypto.subtle.generateKey(
          { name: "HMAC", hash: "SHA-512" },
          true,
          ["sign", "verify"],
        );
        const jwt = await create(
          { alg: "HS512", typ: "JWT", exp: 60*60 },
          { name: user.name, email: user.email },
          key,
        );
        const payload = await verify(jwt, key); // { foo: "bar" };
        ctx.response.body = {
          id: user.id,
          name: user.name,
          email: user.email,
          jwt: jwt,
        };
      }
    }
  }

  async register(ctx: RouterContext) {
    const result = ctx.request.body(); // content type automatically detected
    if (result.type === "json") {
      const value = await result.value; // an object of parsed JSON
      const { name, email, password } = value;
      let _user = await User.findOne({ email: email });
      if (_user) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Email is already used" };
        return;
      }
      const hashedPassword = hashSync(password);
      const user = new User(name, email, hashedPassword);
      await user.save();
      ctx.response.status = 201;
      ctx.response.body = user;
    } else {
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Error, type of document is not a JSON/BSON",
      };
    }
  }
}

const authController = new AuthController();

export default authController;
