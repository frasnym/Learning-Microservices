import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@frntickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		userId: 'randomID',
		version: 0,
		expiresAt: 'randomDate',
		ticket: {
			id: 'randomID',
			price: 10,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

describe('Order Created Listener', () => {
	test('should replicates the order info', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		const order = await Order.findById(data.id);

		expect(order?.price).toBe(data.ticket.price);
	});

	test('should acks the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	});
});
