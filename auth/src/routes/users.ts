import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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
				throw new Error('Invalid email or password');
			}

			console.log('Creating user...');
			throw new Error('Error connecting to database');

			return res.send('ok signup');
		}
	);

export { router as usersRouter };
