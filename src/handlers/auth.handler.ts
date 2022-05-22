import { FastifyRequest } from "fastify";
import { userService } from "../services";
import {
  IAuthLoginBodyRequest,
  IAuthRefreshTokenResponse,
  IAuthRegisterBodyRequest,
} from "../interfaces/types/handlers/auth.handler.types";
import { authErrors } from "../errors";
import customError from "../utils/custom-error";
import { IUserAttributes } from "../interfaces/types/models/user.model.types";

export const handleLogin = async (request: IAuthLoginBodyRequest) => {
  const { email, password } = request.body;
  const login = await userService.userLogin(email, password);
  return login;
};

export const handleRegister = async (
  request: IAuthRegisterBodyRequest
): Promise<IUserAttributes> => {
  const { email, password, name, surname, phone } = request.body;
  const user: IUserAttributes = await userService
    .createUser({
      email,
      password,
      name,
      surname,
      phone,
    })
    .catch((err) => {
      customError(authErrors.AuthRegisterFailure);
      throw new Error();
    });
  return user;
};

export const handleRefreshToken = async (
  request: FastifyRequest
): Promise<IAuthRefreshTokenResponse> => {
  const { UserId } = request;
  const accessToken = userService.createToken(UserId!);
  const response: IAuthRefreshTokenResponse = {
    accessToken,
  };
  return response;
};

export default {
  handleLogin,
  handleRegister,
  handleRefreshToken,
};
