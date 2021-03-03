import request from 'supertest';
import { app } from '../../app';

describe('New Routes', () => {
	test('should has a route handler listening to /api/tickets for POST method', async () => {
		const response = await request(app).post('/api/tickets').send({});

		expect(response.status).not.toBe(404);
	});

	test.todo('should can be accessed if the user is signed in');

	test.todo('should returns an error if an invalid title is provided');

	test.todo('should returns an error if an invalid price is provided');

	test.todo('should successfully create a ticket with valid input provided');
});
