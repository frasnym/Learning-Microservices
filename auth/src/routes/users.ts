import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router
	.route('/signup')
	.post(
		[
			body('email').isEmail().withMessage('Email must be valid'),
			body('password')
				.trim()
				.isLength({ min: 4, max: 20 })
				.withMessage('Password must be between 4 and 20 character'),
		],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw new RequestValidationError(errors.array());
			}

			console.log('Creating user...');
			throw new DatabaseConnectionError();

			return res.send('ok signup');
		}
	);

export { router as usersRouter };
