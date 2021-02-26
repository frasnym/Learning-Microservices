import express from 'express';
import { usersRouter } from './routes/users';

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);

app.listen(3000, () => {
	console.log('Listening on PORT 3000');
});

/**
 * !Solve Err: Error: write EPIPE
 */
process.stdout.on('error', function (err) {
	if (err.code == 'EPIPE') {
		process.exit(0);
	}
});

/**
 * TODO
 * [auth] npm ERR! path /app
 * [auth] npm ERR! command failed
 * [auth] npm ERR! signal SIGKILL
 * [auth] npm ERR! command sh -c ts-node-dev ./src/app.ts
 * [auth]
 * [auth] npm ERR! A complete log of this run can be found in:
 * [auth] npm ERR!     /root/.npm/_logs/2021-02-25T09_08_39_044Z-debug.log
 */
