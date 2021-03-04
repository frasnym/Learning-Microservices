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
	test.todo('should a 401 if the user is not authenticated');
	test.todo("should a 401 if the user doesn't own the ticket");
	test.todo('should a 400 if invalid title or price provided');
	test.todo('should updates the ticket with valid value provided');
});
