import { requireAuth, validateRequest } from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = Router();

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('TicketId must be provided'),
	],
	validateRequest,
	async (_req: Request, res: Response) => {
		res.send({});
	}
);

export { router as newOrderRouter };
