import { ErrorRequestHandler } from 'express';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof RequestValidationError) {
		const formattedErrors = err.errors.map((e) => {
			return {
				message: e.msg,
				field: e.param,
			};
		});
		return res.status(400).send({ errors: formattedErrors });
	}

	if (err instanceof DatabaseConnectionError) {
		return res.status(500).send({ errors: [{ message: err.reason }] });
	}

	return res.status(500).send({
		errors: [{ message: 'Something went wrong...' }],
	});
};
