import { Request, Response, Router } from "express";
// Helpers
import { response } from "../helpers/models";
// Services
import * as authService from "../services/authService";
// Validations
import { signUpValidation } from "../validations/authValidations";

class AuthController {
  public path: string = "/api/auth";
  public router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/register`, signUpValidation, this.signUp);
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const result = await authService.signUp(req.body);
      const resBody = result.getBody();

      if (result.status == 200) {
        const { profile, token } = resBody.data;
        resBody.data = { token, profile };
      }
      return res.status(result.status).json(resBody);
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };
}

export default AuthController;
