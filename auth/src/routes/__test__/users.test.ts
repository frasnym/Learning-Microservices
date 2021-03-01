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

	test('should returns 400 with if invalid password provided', async () => {
		return request(app)
			.post('/api/users/signup')
			.send({
				email: 'test@test.com',
				password: 'p',
			})
			.expect(400);
	});

	test('should returns 400 with if no email and password provided', async () => {
		await request(app)
			.post('/api/users/signup')
			.send({ email: 'test@test.com' })
			.expect(400);
		await request(app)
			.post('/api/users/signup')
			.send({ password: 'password' })
			.expect(400);
	});

	test('should disallows register duplicate emails', async () => {
		const validBody = {
			email: 'test@test.com',
			password: 'password',
		};
		await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(201);

		await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(400);
	});

	test('should sets a cookie after successful signup', async () => {
		const validBody = {
			email: 'test@test.com',
			password: 'password',
		};
		const response = await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(201);

		expect(response.get('Set-Cookie')).toBeDefined();
	});
});

describe('usersRouter - Sign In', () => {
	test('should fails when an invalid email is provided', async () => {
		await request(app)
			.post('/api/users/signin')
			.send({
				email: 'invalid_email',
				password: 'password',
			})
			.expect(400);
	});

	test('should fails when an invalid password is provided', async () => {
		const validBody = {
			email: 'test@test.com',
			password: 'password',
		};
		await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(201);

		await request(app)
			.post('/api/users/signin')
			.send({
				email: validBody.email,
				password: 'invalid_password',
			})
			.expect(400);
	});
});
