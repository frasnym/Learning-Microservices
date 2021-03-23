import { ExpirationCompleteEvent } from '@frntickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const order = Order.build({
		userId: '123',
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket: ticket.id,
	});
	await order.save();

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, order, data, msg };
};

describe('Expiration Complete Listener', () => {
	test('should updates the order status to cancelled', async () => {
		const { listener, order, data, msg } = await setup();
		await listener.onMessage(data, msg);

		const updatedOrder = await Order.findById(order.id);
		expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
	});

	test('should emit an order:cancelled event', async () => {
		const { listener, order, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(natsWrapper.client.publish).toHaveBeenCalled();

		const eventData = JSON.parse(
			(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
		);
		expect(eventData.id).toBe(order.id);
	});

	test('should ack the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	});
});
