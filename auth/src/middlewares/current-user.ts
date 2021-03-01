import { RequestHandler } from 'express';

import jwt from 'jsonwebtoken';

interface UserPayload {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const currentUser: RequestHandler = (req, _res, next) => {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		const jwtPayload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;
		req.currentUser = jwtPayload;
	} catch (error) {}

	next();
};
