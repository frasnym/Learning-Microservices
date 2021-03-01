import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';

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
			const { email, password } = req.body;

			const existingUser = await User.findOne({ email });
			if (!existingUser) {
				throw new BadRequestError('Invalid credentials');
			}

			const isPasswordMatch = await Password.compare(
				existingUser.password,
				password
			);
			if (!isPasswordMatch) {
				throw new BadRequestError('Invalid credentials');
			}

			const jwtPayload = {
				id: existingUser.id,
				email: existingUser.email,
			};
			const userJwt = jwt.sign(jwtPayload, process.env.JWT_KEY!);
			req.session = { jwt: userJwt };

			return res.status(200).send(existingUser);
		}
	);

router.route('/currentuser').get(async (req: Request, res: Response) => {
	if (!req.session?.jwt) {
		return res.send({ currentUser: null });
	}

	try {
		const jwtPayload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
		return res.send({ currentUser: jwtPayload });
	} catch (error) {
		return res.send({ currentUser: null });
	}
});

router.route('/signout').post(async (req: Request, res: Response) => {
	req.session = null;
	return res.send();
});

export { router as usersRouter };
