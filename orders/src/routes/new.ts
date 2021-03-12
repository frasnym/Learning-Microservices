import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes (15 * 60s)

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

		const expiration = new Date();
		expiration.setSeconds(
			expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
		);

		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});
		await order.save();

		const publisher = new OrderCreatedPublisher(natsWrapper.client);
		publisher.publish({
			id: order.id,
			version: order.__v!,
			status: order.status,
			expiresAt: order.expiresAt.toISOString(),
			userId: order.userId,
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		});

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
