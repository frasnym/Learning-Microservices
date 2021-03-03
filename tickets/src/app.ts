import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler, currentUser } from '@frntickets/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // trust connection from ingress
app.use(express.json());
app.use(
	cookieSession({
		signed: false, // disable encryption
		secure: process.env.NODE_ENV !== 'test', // enable only on https connection on "Production" or "Development"
	})
);
app.use(currentUser);
app.use(createTicketRouter);

app.all('*', async () => {
	throw new NotFoundError();
});
app.use(errorHandler);

export { app };
