import { Request, Response, NextFunction } from 'express';

export const convertSpecificFieldsToNumber = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        req.body[field] = parseFloat(req.body[field]);
      }
    });
    next();
  };
};