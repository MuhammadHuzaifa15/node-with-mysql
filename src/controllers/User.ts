import { Router, Request, Response } from "express";

// Middlewares
import auth from "../middleware/auth";

// Services
import * as userService from "../services/userService";

// Helpers
import { response } from "../helpers/models";

class UserController {
  public path: string = "/api/users";
  public router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes = () => {
    this.router.get(`${this.path}/me`, auth(), this.getLoggedInUser);

    this.router.get(`${this.path}/:userId`, auth(), this.getUserById);
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const result = await userService.getByIdAsync({ id: req.params.userId });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  getLoggedInUser = async (req: Request, res: Response) => {
    try {
      const result = await userService.getByIdAsync(req.body.user);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };
}

export default UserController;
