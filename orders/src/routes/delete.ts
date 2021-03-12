import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate(
			'ticket'
		);
		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		const publisher = new OrderCancelledPublisher(natsWrapper.client);
		publisher.publish({
			id: order.id,
			version: order.__v!,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(204).send(order);
	}
);

export { router as deleteOrderRouter };
