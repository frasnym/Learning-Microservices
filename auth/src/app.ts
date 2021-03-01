import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { usersRouter } from './routes/users';

const app = express();
app.set('trust proxy', true); // trust connection from ingress
app.use(express.json());
app.use(
	cookieSession({
		signed: false, // disable encryption
		secure: true, // enable only on https connection
	})
);

app.use('/api/users', usersRouter);
app.all('*', async () => {
	throw new NotFoundError();
});
app.use(errorHandler);

export { app };
