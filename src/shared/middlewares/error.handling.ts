import ApiError from './../../utils/api.error';
import { Response, Request, NextFunction } from 'express';

const sendErrorInProduction = (error: ApiError, res: Response): void => {
  res.status(error.statuscode).json({
    status: error.status,
    message: error.message
  });
};

const sendErrorInDevelopment = (error: ApiError, res: Response): void => {
  res.status(error.statuscode).json({
    status: error.status,
    message: error.message,
    stack: error.stack
  });
};

const globalErrorHandler = (error: ApiError, req: Request, res: Response, next: NextFunction): void => {
  error.statuscode = error.statuscode || 500;
  error.status = error.status || 'Error';
  if (process.env.MODE === 'Development') {
    sendErrorInDevelopment(error,res);
  } else {
    sendErrorInProduction(error,res) ;
  };
};

export default globalErrorHandler;