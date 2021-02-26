import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	console.error('[Err Middleware]', err);

	res.status(400).send({
		message: err.message,
	});
};
