import { Router, Request, Response } from "express";

// Middlewares
import auth from "../middleware/auth";

// Services
import * as userService from "../services/userService";

// Helpers
import { response } from "../helpers/models";
import { createAddressValidation } from "../validations/addressValidations";

class UserController {
  public path: string = "/api/users";
  public router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes = () => {
    this.router.get(`${this.path}/me`, auth(), this.getLoggedInUser);

    this.router.post(
      `${this.path}/address`,
      auth(),
      createAddressValidation,
      this.createAddress
    );

    this.router.get(
      `${this.path}/address`,
      auth(),
      this.getAllAddresses
    );

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

  createAddress = async (req: Request, res: Response) => {
    try {
      const result = await userService.createAddressAsync({
        user: req.body.user,
        ...req.body,
      });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  getAllAddresses = async (req: Request, res: Response) => {
    try {
      const result = await userService.getAllAddressesAsync(req.body.user);
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
