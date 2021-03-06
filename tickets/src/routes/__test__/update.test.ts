import request from 'supertest';
import { app } from '../../app';

import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

describe('Update route', () => {
	test('should returns a 404 if the provided id does not exist', async () => {
		const invalidId = new mongoose.Types.ObjectId().toHexString();

		await request(app)
			.put(`/api/tickets/${invalidId}`)
			.set('Cookie', global.signin())
			.send({
				title: 'valid_title',
				price: 20,
			})
			.expect(404);
	});

	test('should returns a 401 if the user is not authenticated', async () => {
		const id = new mongoose.Types.ObjectId().toHexString();

		await request(app)
			.put(`/api/tickets/${id}`)
			.send({
				title: 'valid_title',
				price: 20,
			})
			.expect(401);
	});

	test("should returns a 401 if the user doesn't own the ticket", async () => {
		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({ title: 'valid_title', price: 20 });

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', global.signin())
			.send({
				title: 'another_title',
				price: 1000,
			})
			.expect(401);
	});

	test('should returns a 400 if invalid title or price provided', async () => {
		const cookie = global.signin();

		const validTitle = 'valid_title';
		const invalidTitle = '';
		const validPrice = 20;
		const invalidPrice = -20;

		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', cookie)
			.send({ title: validTitle, price: validPrice })
			.expect(201);

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: invalidTitle,
				price: validPrice,
			})
			.expect(400);

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: validTitle,
				price: invalidPrice,
			})
			.expect(400);
	});

	test('should updates the ticket with valid value provided', async () => {
		const cookie = global.signin();

		const validTitle = 'another_valid_title';
		const validPrice = 30;

		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', cookie)
			.send({ title: 'valid_title', price: 20 })
			.expect(201);

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: validTitle,
				price: validPrice,
			})
			.expect(200);

		const ticketResponse = await request(app)
			.get(`/api/tickets/${response.body.id}`)
			.expect(200);

		expect(ticketResponse.body.title).toBe(validTitle);
		expect(ticketResponse.body.price).toBe(validPrice);
	});

	test('should published an event', async () => {
		const cookie = global.signin();

		const validTitle = 'another_valid_title';
		const validPrice = 30;

		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', cookie)
			.send({ title: 'valid_title', price: 20 })
			.expect(201);

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: validTitle,
				price: validPrice,
			})
			.expect(200);

		expect(natsWrapper.client.publish).toHaveBeenCalled();
	});

	test('should rejects an updates if the ticket is reserved', async () => {
		const cookie = global.signin();

		const validTitle = 'another_valid_title';
		const validPrice = 30;

		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', cookie)
			.send({ title: 'valid_title', price: 20 })
			.expect(201);

		const ticket = await Ticket.findById(response.body.id);
		ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
		await ticket?.save();

		await request(app)
			.put(`/api/tickets/${response.body.id}`)
			.set('Cookie', cookie)
			.send({
				title: validTitle,
				price: validPrice,
			})
			.expect(400);
	});
});
