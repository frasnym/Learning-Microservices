import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	return ticket;
};

describe('Order New Routes', () => {
	test('should returns not found error if the ticket does not exist', async () => {
		const ticketId = mongoose.Types.ObjectId();

		await request(app)
			.post('/api/orders')
			.set('Cookie', global.signin())
			.send({
				ticketId,
			})
			.expect(404);
	});

	test('should returns bad request error if the ticket is already reserved', async () => {
		const ticket = await buildTicket();

		const order = Order.build({
			ticket: ticket,
			userId: 'randomid',
			status: OrderStatus.Created,
			expiresAt: new Date(),
		});
		await order.save();

		await request(app)
			.post('/api/orders')
			.set('Cookie', global.signin())
			.send({
				ticketId: ticket.id,
			})
			.expect(400);
	});

	test('should sucessfully reserves a ticket', async () => {
		const ticket = await buildTicket();

		await request(app)
			.post('/api/orders')
			.set('Cookie', global.signin())
			.send({ ticketId: ticket.id })
			.expect(201);
	});

	test('should emits an order created event', async () => {
		const ticket = await buildTicket();

		await request(app)
			.post('/api/orders')
			.set('Cookie', global.signin())
			.send({ ticketId: ticket.id })
			.expect(201);

		expect(natsWrapper.client.publish).toHaveBeenCalled();
	});
});
