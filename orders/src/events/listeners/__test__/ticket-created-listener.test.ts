import { TicketCreatedEvent } from '@frntickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);

	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
		userId: mongoose.Types.ObjectId().toHexString(),
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

describe('Ticket Created Listener', () => {
	test('should creates and saves a ticket', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		const ticket = await Ticket.findById(data.id);

		expect(ticket).toBeDefined();
		expect(ticket!.title).toBe(data.title);
		expect(ticket!.price).toBe(data.price);
	});

	test('should acks the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	});
});
