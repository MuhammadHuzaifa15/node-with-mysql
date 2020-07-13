import { Response } from "express";
import path from "path";
import fs from "fs";

// Repository
import * as FileRepository from "../repositories/File";

// Helpers
import { response } from "../helpers/models";

interface ISaveFile {
  files: any;
  user: {
    id: string;
  };
}

interface IGetById {
  id: string;
}

interface IGetFileById {
  id: string;
  res: Response;
}

interface IDeleteById {
  id: string;
}

const saveFileAsync = async (params: ISaveFile) => {
  const { files } = params;

  // Save File
  const newFiles = await FileRepository.create(files);

  // If fail to save in database
  if (!newFiles) {
    return new response(400).setMsg("Failed to upload file.");
  }

  const fileIds = newFiles.map((file) => file.dataValues.id);

  // Response
  return new response(200, fileIds);
};

const getByIdAsync = async (params: IGetById) => {
  const { id } = params;
  // Get file from database
  const file = await FileRepository.getById(id);

  if (!file) {
    return new response(404).setMsg("File not found.");
  }

  // Response
  return new response(200, file);
};

const getFileByIdAsync = async (params: IGetFileById) => {
  const { id, res } = params;
  // Get file from database
  const file = await FileRepository.getById(id);

  if (!file) {
    return new response(404).setMsg("File not found.");
  }

  let pathToFile: string = "";
  if (process.env.APP === "dev") {
    pathToFile = "../../";
  } else {
    pathToFile = "../../../";
  }

  return res.sendFile(path.join(__dirname, pathToFile, file.dataValues.path));
};

const deleteByIdAsync = async (params: IDeleteById) => {
  const { id } = params;
  // Get file from database
  const file = await FileRepository.getById(id);

  if (!file) {
    return new response(404).setMsg("File not found.");
  }

  fs.unlinkSync(file.dataValues.path);

  // Soft delete file in database
  await FileRepository.update(id);

  // Response
  return new response(200);
};

export { saveFileAsync, getByIdAsync, deleteByIdAsync, getFileByIdAsync };
