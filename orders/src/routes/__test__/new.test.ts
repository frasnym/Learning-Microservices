import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

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
	test.todo(
		'should returns bad request error if the ticket is already reserved'
	);
	test.todo('should sucessfully reserved a ticket');
});
