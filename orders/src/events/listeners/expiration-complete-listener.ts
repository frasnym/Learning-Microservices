import {
	ExpirationCompleteEvent,
	Listener,
	OrderStatus,
	Subjects,
} from '@frntickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId).populate('ticket');
		if (!order) {
			return console.error('Order not found!');
		}
		if (order.status === OrderStatus.Complete) {
			console.error('Order is already completed!');
			return msg.ack();
		}

		order.set({
			status: OrderStatus.Cancelled,
		});
		await order.save();

		await new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id,
			},
		});

		msg.ack();
	}
}
