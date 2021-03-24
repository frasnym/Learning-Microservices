import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@frntickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Created,
		userId: 'randomId',
		version: 0,
	});
	await order.save();

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: order.version + 1,
		ticket: {
			id: 'randomID',
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, order, data, msg };
};

describe('Order Cancelled Listener', () => {
	test('should update the status of the order', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		const updatedOrder = await Order.findById(data.id);

		expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
	});

	test('should acks the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled;
	});
});
