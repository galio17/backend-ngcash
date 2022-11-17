import { RequestHandler } from "express";
import { AnySchema, ValidationError } from "yup";
import AppError from "../errors";

export const validateSchemaMiddleware =
  (schema: AnySchema): RequestHandler =>
  async (req, _res, next) => {
    try {
      const validatedBody = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.validBody = validatedBody;

      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        const { errors } = err;

        throw new AppError(errors);
      }

      throw err;
    }
  };
