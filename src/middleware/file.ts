import { Request, Response, NextFunction } from 'express';
const multer = require('multer');

// Helpers
const { response } = require('../helpers/models');

interface MulterRequest extends Request {
  file: any;
  files: any;
}

class FileMiddleware {
  public upload: any;
  constructor() {
    let storage = multer.diskStorage({
      destination: function (req: Request, file: any, callback: any) {
        callback(null, './uploads');
      },
      filename: function (req: Request, file: any, callback: any) {
        let ext = file.originalname.split('.').pop();
        callback(null, Date.now() + '.' + ext);
      }
    });

    var maxSize = 10485760; // 10 MB

    this.upload = multer({
      storage: storage,
      limits: { fileSize: maxSize, files: 5 }
    });
  }

  uploadMultiple = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      this.upload.array('files', 5)(req, res, function (err: any) {
        let result;
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log(err.message);
          if (err.code === 'LIMIT_FILE_SIZE') {
            result = new response(413).setMsg(
              'Please select files less than equal to 10 MB.'
            );
          } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            result = new response(400).setMsg('Files is required.');
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            result = new response(429).setMsg(
              'Too many files. Please select 5 files at most.'
            );
          } else {
            result = new response(503).setMsg('Error uploading file.');
          }
          return res.status(result.status).json(result.getBody());
        } else if (err) {
          // An unknown error occurred when uploading.
          console.log(err.message);
          result = new response(501).setMsg('Error uploading file.');
          return res.status(result.status).json(result.getBody());
        }
        // File uploaded
        const files = (req as MulterRequest).files;
        req.body.files = files;

        next();
      });
    };
  };
}

export default FileMiddleware;
