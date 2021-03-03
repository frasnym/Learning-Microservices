import { requireAuth, validateRequest } from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post(
	'/api/tickets',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be grater than 0'),
	],
	validateRequest,
	(_req: Request, res: Response) => {
		return res.sendStatus(200);
	}
);

export { router as createTicketRouter };
