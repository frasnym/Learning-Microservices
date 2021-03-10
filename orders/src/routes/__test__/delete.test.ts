import { OrderStatus } from '@frntickets/common';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

describe('Delete Order Route', () => {
	test('should marks order as cancelled', async () => {
		const ticket = await Ticket.build({
			title: 'concert',
			price: 20,
		});
		await ticket.save();

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

	test.todo('should emits an order:cancelled event');
});
