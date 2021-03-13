import { OrderCreatedEvent, OrderStatus } from '@frntickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: 'concert',
		price: 10,
		userId: 'randomId',
	});
	await ticket.save();

	const data: OrderCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: 'randomId',
		expiresAt: new Date().toISOString(),
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, data, msg };
};

describe('Order Created Listener', () => {
	test('should sets the orderId of the ticket', async () => {
		const { listener, ticket, data, msg } = await setup();
		await listener.onMessage(data, msg);

		const updatedTicket = await Ticket.findById(ticket.id);

		expect(updatedTicket!.orderId).toBe(data.id);
	});

	test('should acks the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	});
});
