import { ErrorRequestHandler } from 'express';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof RequestValidationError) {
		return res
			.status(err.statusCode)
			.send({ errors: err.serializeErrors() });
	}

	if (err instanceof DatabaseConnectionError) {
		return res
			.status(err.statusCode)
			.send({ errors: err.serializeErrors() });
	}

	return res.status(500).send({
		errors: [{ message: 'Something went wrong...' }],
	});
};
