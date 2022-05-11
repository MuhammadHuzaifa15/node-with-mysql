import { Router, Request, Response } from "express";

// Middlewares
import FileMiddleware from "../middleware/file";
import auth from "../middleware/auth";

// Services
import * as fileService from "../services/fileService";

// Helpers
import { response } from "../helpers/models";

// Validations
import {
  uploadFileValidation,
  getFileValidation,
} from "../validations/fileValidations";

class FileController {
  public path: string = "/api/files";
  public router: Router = Router();
  public file: FileMiddleware = new FileMiddleware();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes = () => {
    this.router.post(
      `${this.path}/`,
      auth(),
      this.file.uploadMultiple(),
      uploadFileValidation,
      this.saveFile
    );

    this.router.get(
      `${this.path}/meta/:id`,
      auth(),
      getFileValidation,
      this.getById
    );

    this.router.get(`${this.path}/:id`, getFileValidation, this.getFileById);

    this.router.delete(
      `${this.path}/:id`,
      auth(),
      getFileValidation,
      this.deleteById
    );
  };

  saveFile = async (req: Request, res: Response) => {
    try {
      const result = await fileService.saveFileAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      req.body.id = req.params.id;
      const result = await fileService.getByIdAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  getFileById = async (req: Request, res: Response) => {
    try {
      req.body.id = req.params.id;

      let result = await fileService.getFileByIdAsync({ ...req.body, res });
      if (result instanceof response) {
        return res.status(result.status).json(result.getBody());
      } else {
        return result;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };

  deleteById = async (req: Request, res: Response) => {
    try {
      req.body.id = req.params.id;
      const result = await fileService.deleteByIdAsync(req.body);
      return res.status(result.status).json(result.getBody());
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      const result = new response(500).setMsg("Server error");
      return res.status(result.status).json(result.getBody());
    }
  };
}

export default FileController;
