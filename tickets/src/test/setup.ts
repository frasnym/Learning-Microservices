import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
		}
	}
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'asdfasdf';

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = () => {
	// 1. Build JWT payload {id, email}
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};

	// 2. Create JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// 3. Build session object {jwt}
	const session = { jwt: token };

	// 4. Convert session object to JSON
	const sessionJSON = JSON.stringify(session);

	// 5. Encode session JSON to base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// 6. Return a string thats the cookie with encoded data
	return [`express:sess=${base64}`];
};
