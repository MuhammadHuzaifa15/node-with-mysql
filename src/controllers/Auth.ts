import { Request, Response, Router } from "express";
// Helpers
import { response } from "../helpers/models";
// Services
import * as authService from "../services/authService";
// Middleware
import passport from "../../config/passport";
// Validations
import {
  signUpValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  forgotPasswordVerifyValidation,
  signInValidation,
} from "../validations/authValidations";

class AuthController {
  public path: string = "/api/auth";
  public router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/register`, signUpValidation, this.signUp);

    this.router.put(`${this.path}/verify`, verifyOTPValidation, this.verifyOTP);

    this.router.post(`${this.path}/login`, signInValidation, this.signIn);

    this.router.get(
      `${this.path}/google`,
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      })
    );

    this.router.get(
      `${this.path}/google/callback`,
      passport.authenticate("google"),
      this.signInWithGoogle
    );

    this.router.get(
      `${this.path}/facebook`,
      passport.authenticate("facebook", { scope: ["email", "public_profile"] })
    );

    this.router.get(
      `${this.path}/facebook/callback`,
      passport.authenticate("facebook"),
      this.signInWithFacebook
    );

    this.router.post(
      `${this.path}/forgot-password`,
      forgotPasswordValidation,
      this.forgotPassword
    );

    this.router.get(
      `${this.path}/forgot-password/verify`,
      forgotPasswordVerifyValidation,
      this.forgotPasswordVerification
    );

    this.router.put(
      `${this.path}/reset-password`,
      resetPasswordValidation,
      this.resetPassword
    );
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

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const result = await authService.verifyOTP(req.body);
      return res.status(result.status).json(result);
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const result = await authService.signIn(req.body);
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

  signInWithGoogle = async (req: Request, res: Response) => {
    const user: any = req.user;

    try {
      const result = await authService.signInWithGoogle({
        user: user.user,
        onBoarding: user.onBoarding,
      });
      return res.status(result.status).json(result);
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  signInWithFacebook = async (req: Request, res: Response) => {
    const user: any = req.user;

    try {
      const result = await authService.signInWithFacebook({
        user: user.user,
        onBoarding: user.onBoarding,
      });
      return res.status(result.status).json(result);
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const result = await authService.forgotPasswordAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  forgotPasswordVerification = async (req: Request, res: Response) => {
    try {
      const result = await authService.forgotPasswordVerifyAsync({
        // @ts-ignore
        code: req.headers["otp-token"]?.toString(),
      });
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const result = await authService.resetPasswordAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      console.log(err.message);
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };
}

export default AuthController;
