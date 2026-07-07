import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { IRequestUser } from "../module/auth/auth.interface";
import { hasPermissions, PermissionKey } from "../constants/permissions";

export const checkPermission =
  (...requiredPermissions: PermissionKey[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user as IRequestUser | undefined;

      if (!user) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! User context is missing.",
        );
      }

      if (!hasPermissions(user.role, requiredPermissions)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "Forbidden access! Required permission is missing.",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
