import { Router, Request, Response } from "express";

// Middlewares
import auth from "../middleware/auth";

// Services
import * as userService from "../services/userService";

// Helpers
import { response } from "../helpers/models";
import {
  createAddressValidation,
  updateAddressValidation,
} from "../validations/addressValidations";
import { updateUserValidation } from "../validations/userValidations";

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

    this.router.get(`${this.path}/address`, auth(), this.getAllAddresses);

    this.router.put(
      `${this.path}/address`,
      auth(),
      updateAddressValidation,
      this.updateAddress
    );

    this.router.get(`${this.path}/address/:id`, auth(), this.getAddressById);

    this.router.delete(
      `${this.path}/address/:id`,
      auth(),
      this.deleteAddressById
    );

    this.router.put(
      `${this.path}`,
      auth(),
      updateUserValidation,
      this.updateUser
    );

    this.router.get(`${this.path}`, auth(), this.getAll);

    this.router.get(`${this.path}/:userId`, auth(), this.getUserById);

    this.router.delete(`${this.path}/:id`, auth(), this.deleteUserById);
  };

  getAddressById = async (req: Request, res: Response) => {
    try {
      const result = await userService.getAddressByIdAsync({
        id: req.params.id,
      });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  deleteAddressById = async (req: Request, res: Response) => {
    try {
      const result = await userService.deleteAddressByIdAsync({
        id: req.params.id,
        user: req.body.user,
      });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
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

  deleteUserById = async (req: Request, res: Response) => {
    try {
      const result = await userService.deleteByIdAsync({ id: req.params.id });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  createAddress = async (req: Request, res: Response) => {
    try {
      const result = await userService.createAddressAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  updateAddress = async (req: Request, res: Response) => {
    try {
      const result = await userService.updateAddressAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const result = await userService.updateUserAsync(req.body);
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

  getAll = async (req: Request, res: Response) => {
    try {
      const result = await userService.getAllAsync(req.query);
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
