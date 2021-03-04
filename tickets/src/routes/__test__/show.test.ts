import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

describe('Show routes', () => {
	test('should returns a 404 if the ticket is not found', async () => {
		const invalidId = new mongoose.Types.ObjectId().toHexString();
		await request(app).get(`/api/tickets/${invalidId}`).expect(404);
	});

	test('should returns a tickets if the ticket is found', async () => {
		const title = 'valid_title';
		const price = 20;

		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({ title, price })
			.expect(201);

		const ticketResponse = await request(app)
			.get(`/api/tickets/${response.body.id}`)
			.expect(200);

		expect(ticketResponse.body.title).toBe(title);
		expect(ticketResponse.body.price).toBe(price);
	});
});
