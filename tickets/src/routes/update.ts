import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be grater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			throw new NotFoundError();
		}
		if (ticket.orderId) {
			throw new BadRequestError('Cannot edit a reserved ticket');
		}
		if (ticket.userId !== req.currentUser?.id) {
			throw new NotAuthorizedError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});
		await ticket.save();

		const publisher = new TicketUpdatedPublisher(natsWrapper.client);
		publisher.publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
		});

		return res.send(ticket);
	}
);

export { router as updateTicketRouter };
