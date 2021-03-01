import request from 'supertest';
import { app } from '../../app';

describe('usersRouter - Sign Up', () => {
	test('should returns 201 on successful signup', async () => {
		return request(app)
			.post('/api/users/signup')
			.send({
				email: 'test@test.com',
				password: 'password',
			})
			.expect(201);
	});

	test('should returns 400 with if invalid email provided', async () => {
		return request(app)
			.post('/api/users/signup')
			.send({
				email: 'invalid_email',
				password: 'password',
			})
			.expect(400);
	});
});
