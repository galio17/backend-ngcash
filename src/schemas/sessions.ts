import * as yup from "yup";
import { IUserRequest } from "../interfaces";

export const loginSchema: yup.SchemaOf<IUserRequest> = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});
