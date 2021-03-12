import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	return ticket;
};

describe('Show Order Route', () => {
	test('should fetches the order', async () => {
		const ticket = await buildTicket();

		const user = global.signin();
		const { body: order } = await request(app)
			.post('/api/orders')
			.set('Cookie', user)
			.send({
				ticketId: ticket.id,
			})
			.expect(201);

		const { body: fetchedOrder } = await request(app)
			.get(`/api/orders/${order.id}`)
			.set('Cookie', user)
			.expect(200);

		expect(fetchedOrder.id).toBe(order.id);
	});

	test('should returns not authorized error if invalid user try to access coresponding order', async () => {
		const ticket = await buildTicket();

		const { body: order } = await request(app)
			.post('/api/orders')
			.set('Cookie', global.signin())
			.send({
				ticketId: ticket.id,
			})
			.expect(201);

		await request(app)
			.get(`/api/orders/${order.id}`)
			.set('Cookie', global.signin())
			.expect(401);
	});
});
