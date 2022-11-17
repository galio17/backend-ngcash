import * as yup from "yup";
import { IUserRequest } from "../interfaces";

export const createUserSchema: yup.SchemaOf<IUserRequest> = yup.object().shape({
  username: yup.string().required().min(3),
  password: yup
    .string()
    .min(8)
    .matches(/[A-Z]/, "password must have capital letter")
    .matches(/\d/, "password must have number")
    .matches(/[.!@#$%&]/, "password must have number")
    .required(),
});
