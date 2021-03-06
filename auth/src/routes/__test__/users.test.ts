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

	test('should responds with a cookie with valid credentials is provided', async () => {
		const validBody = {
			email: 'test@test.com',
			password: 'password',
		};
		await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(201);

		const response = await request(app)
			.post('/api/users/signin')
			.send(validBody)
			.expect(200);

		expect(response.get('Set-Cookie')).toBeDefined();
	});
});

describe('usersRouter - Sign Out', () => {
	test('should clear the cookie after sign-out', async () => {
		const validBody = {
			email: 'test@test.com',
			password: 'password',
		};
		await request(app)
			.post('/api/users/signup')
			.send(validBody)
			.expect(201);

		const response = await request(app)
			.post('/api/users/signout')
			.send({})
			.expect(200);

		expect(response.get('Set-Cookie')).toBeDefined();
		expect(response.get('Set-Cookie')[0]).toEqual(
			'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
		);
	});
});

describe('usersRouter - CurrentUser', () => {
	test('should responds with details about current user', async () => {
		const cookie = await global.signup();

		const response = await request(app)
			.get('/api/users/currentuser')
			.set('Cookie', cookie)
			.expect(200);
		expect(response.body.currentUser.email).toBe('test@test.com');
	});

	test('should responds with null if not authenticated', async () => {
		const response = await request(app)
			.get('/api/users/currentuser')
			.expect(200);

		expect(response.body.currentUser).toBeNull();
	});
});
