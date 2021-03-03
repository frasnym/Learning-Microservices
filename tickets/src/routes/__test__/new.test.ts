import request from 'supertest';
import { app } from '../../app';

describe('New Routes', () => {
	test('should has a route handler listening to /api/tickets for POST method', async () => {
		const response = await request(app).post('/api/tickets').send({});
		expect(response.status).not.toBe(404);
	});

	test('should can be accessed if the user is signed in', async () => {
		const response = await request(app).post('/api/tickets').send({});
		expect(response.status).toBe(401);
	});

	test('should return status other that 401 if user is signed in', async () => {
		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({});
		expect(response.status).not.toBe(401);
	});

	test('should returns an error if an invalid title is provided', async () => {
		const response = await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({
				title: '',
				price: 10,
			});
		expect(response.status).toBe(400);
	});

	test('should returns an error if an invalid price is provided', async () => {
		await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({
				title: 'valid_title',
				price: -10,
			})
			.expect(400);

		await request(app)
			.post('/api/tickets')
			.set('Cookie', global.signin())
			.send({
				title: 'valid_title',
			})
			.expect(400);
	});

	test.todo('should successfully create a ticket with valid input provided');
});
