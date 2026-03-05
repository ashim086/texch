import { NextFunction, Request, RequestHandler, Response } from "express"

const asyncHandler = <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req as T, res, next).catch(next)
    }
}

export default asyncHandler;