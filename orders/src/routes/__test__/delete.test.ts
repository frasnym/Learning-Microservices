import mongoose from 'mongoose';
import { OrderStatus } from '@frntickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
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

describe('Delete Order Route', () => {
	test('should marks order as cancelled', async () => {
		const ticket = await buildTicket();

		const user = global.signin();
		const { body: order } = await request(app)
			.post('/api/orders')
			.set('Cookie', user)
			.send({
				ticketId: ticket.id,
			})
			.expect(201);

		await request(app)
			.delete(`/api/orders/${order.id}`)
			.set('Cookie', user)
			.expect(204);

		const updatedOrder = await Order.findById(order.id);
		expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
	});

	test('should emits an order:cancelled event', async () => {
		const ticket = await buildTicket();

		const user = global.signin();
		const { body: order } = await request(app)
			.post('/api/orders')
			.set('Cookie', user)
			.send({
				ticketId: ticket.id,
			})
			.expect(201);

		await request(app)
			.delete(`/api/orders/${order.id}`)
			.set('Cookie', user)
			.expect(204);

		expect(natsWrapper.client.publish).toHaveBeenCalled();
	});
});
