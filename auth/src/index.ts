import express from 'express';
import { usersRouter } from './routes/users';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);

app.listen(3000, () => {
	console.log('Listening on PORT 3000');
});
