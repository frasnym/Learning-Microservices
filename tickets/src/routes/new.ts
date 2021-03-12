import { requireAuth, validateRequest } from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post(
	'/api/tickets',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be grater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const ticket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});
		await ticket.save();

		const publisher = new TicketCreatedPublisher(natsWrapper.client);
		publisher.publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
		});

		return res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
