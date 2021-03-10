import {
	BadRequestError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';

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
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		const isReserver = await ticket.isReserved();
		if (isReserver) {
			throw new BadRequestError('Ticket is already reserved');
		}

		res.send({});
	}
);

export { router as newOrderRouter };
