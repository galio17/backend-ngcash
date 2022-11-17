import * as yup from "yup";
import { ITransferRequest } from "../interfaces";

export const transferSchema: yup.SchemaOf<ITransferRequest> = yup
  .object()
  .shape({
    to: yup.string().required(),
    value: yup.number().required().positive().min(0.01),
  });
