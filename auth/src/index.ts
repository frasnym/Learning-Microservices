import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { usersRouter } from './routes/users';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.all('*', async () => {
	throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log(error);
	}

	app.listen(3000, () => {
		console.log('Listening on PORT 3000!');
	});
};
start();
