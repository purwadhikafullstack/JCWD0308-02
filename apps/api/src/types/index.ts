import type { NextFunction, Request, Response } from "express";

export type ICallback = (req: Request, res: Response, next: NextFunction) => void;