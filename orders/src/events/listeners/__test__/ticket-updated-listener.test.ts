import { TicketUpdatedEvent } from '@frntickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 10,
	});
	await ticket.save();

	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		price: 999,
		title: 'new concert',
		userId: '123qwerty',
		version: ticket.version + 1,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

describe('Ticket Updated Listener', () => {
	test('should find, update, saves a ticket', async () => {
		const { listener, data, msg, ticket } = await setup();
		await listener.onMessage(data, msg);

		const updatedTicket = await Ticket.findById(ticket.id);

		expect(updatedTicket!.title).toBe(data.title);
		expect(updatedTicket!.price).toBe(data.price);
		expect(updatedTicket!.version).toBe(data.version);
	});

	test('should acks the message', async () => {
		const { listener, data, msg } = await setup();
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	});

	test('should not call ack if the event has a skipped version number', async () => {
		const { listener, data, msg } = await setup();
		data.version = 10;
		await listener.onMessage(data, msg);

		expect(msg.ack).not.toHaveBeenCalled();
	});
});
