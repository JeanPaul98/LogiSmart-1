// server/middlewares/validate.ts
import { AnyZodObject, ZodError } from "zod";
import { RequestHandler } from "express";

type Parts = "body" | "query" | "params";

export const validate =
  (schemas: Partial<Record<Parts, AnyZodObject>>): RequestHandler =>
  (req, res, next) => {
    try {
      if (schemas.body)  req.body  = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", issues: err.format() });
      }
      next(err);
    }
  };
