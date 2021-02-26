import express, { Request, Response } from 'express';
import { body } from 'express-validator';

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
			const { email, password } = req.body;

			res.send('ok signup');
		}
	);

export { router as usersRouter };
