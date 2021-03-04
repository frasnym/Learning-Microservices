import request from 'supertest';
import { app } from '../../app';

import mongoose from 'mongoose';

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

	test.todo('should returns a 400 if invalid title or price provided');
	test.todo('should updates the ticket with valid value provided');
});
