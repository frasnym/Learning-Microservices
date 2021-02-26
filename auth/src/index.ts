import express from 'express';
import 'express-async-errors';
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

app.listen(3000, () => {
	console.log('Listening on PORT 3000!');
});
