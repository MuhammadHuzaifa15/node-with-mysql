import { Request, Response, NextFunction } from "express";
import * as UserRepository from "../repositories/User";
import * as jwt from "jsonwebtoken";
const CONFIG = require("../../config/config");

// Helpers
const { response } = require("../helpers/models");

const authMiddleware = (roles?: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      const result = new response(401).setMsg(
        "Authorisation failed. Token not found."
      );
      return res.status(result.status).json(result.getBody());
    }

    try {
      // Decode Token
      const decoded = jwt.verify(token, CONFIG.jwt_secret);
      //@ts-ignore
      req.body.user = decoded.user;

      if (roles) {
        //@ts-ignore
        if (!(await hasAnyRole(decoded.user.id, roles))) {
          const result = new response(403).setMsg(
            "Authorisation failed. Action not allowed."
          );
          return res.status(result.status).json(result.getBody());
        }
      }
      next();
    } catch (err) {
      console.log(err.message);
      const result = new response(401).setMsg("Authorisation failed.");
      return res.status(result.status).json(result.getBody());
    }
  };
};

const hasAnyRole = async (id: string, roles: Array<string>) => {
  const user = await UserRepository.getUserRole(id);
  // @ts-ignore
  if (roles.includes(user?.dataValues.type)) {
    return true;
  }

  return false;
};
export default authMiddleware;
