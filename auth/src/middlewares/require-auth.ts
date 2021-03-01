import { RequestHandler } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth: RequestHandler = (req, _res, next) => {
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}

	next();
};
