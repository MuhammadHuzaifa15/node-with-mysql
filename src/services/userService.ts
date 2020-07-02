import * as UserRepository from "../repositories/User";
import { response } from "../helpers/models";

interface IGetById {
  id: string;
}

// Get User By Id

const getByIdAsync = async (params: IGetById) => {
  const { id } = params;

  const user = await UserRepository.getById(id);

  // Response
  if (!user) {
    return new response(404).setMsg("User not found!");
  }
  return new response(200, user);
};

export { getByIdAsync };
