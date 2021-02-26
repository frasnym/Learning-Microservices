import express from 'express';

const router = express.Router();

router.route('/currentuser').get((req, res) => {
	res.send('hi?');
});

export { router as usersRouter };
