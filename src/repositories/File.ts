import { IFileAttributes, IFileInstance } from "../interfaces/models/File";
import { Models } from "../models/index";
const File = Models.file;

export const getById = async (id: string): Promise<IFileInstance | null> => {
  return File.findOne({
    attributes: ["id", "contentType", "path"],
    where: { isDeleted: false, id },
  });
};

export const create = async (
  payload: IFileAttributes[]
): Promise<IFileInstance[]> => {
  return File.bulkCreate(payload);
};

export const update = async (id: string) => {
  return File.update({ isDeleted: true }, { where: { id } });
};
