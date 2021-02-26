import express from 'express';
import { errorHandler } from './middlewares/error-handler';
import { usersRouter } from './routes/users';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.use(errorHandler);

app.listen(3000, () => {
	console.log('Listening on PORT 3000!');
});
