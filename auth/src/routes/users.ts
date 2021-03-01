import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';

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
		validateRequest,
		async (req: Request, res: Response) => {
			const { email, password } = req.body;

			const existingUser = await User.findOne({ email });
			if (existingUser) {
				throw new BadRequestError('Email in use');
			}

			const user = User.build({ email, password });
			await user.save();

			const jwtPayload = {
				id: user.id,
				email: user.email,
			};
			const userJwt = jwt.sign(jwtPayload, process.env.JWT_KEY!);

			req.session = { jwt: userJwt };

			return res.status(201).send(user);
		}
	);

router
	.route('/signin')
	.post(
		[
			body('email').isEmail().withMessage('Email must be valid'),
			body('password')
				.trim()
				.notEmpty()
				.withMessage('You must supply a password'),
		],
		validateRequest,
		async (req: Request, res: Response) => {
			const { email } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				throw new NotFoundError();
			}

			// const user = User.build({ email, password });
			// await user.save();

			// const jwtPayload = {
			// 	id: user.id,
			// 	email: user.email,
			// };
			// const userJwt = jwt.sign(jwtPayload, process.env.JWT_KEY!);

			// req.session = { jwt: userJwt };

			return res.status(200).send(user);
		}
	);

export { router as usersRouter };
