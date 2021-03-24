import { requireAuth, validateRequest } from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post(
	'/payments',
	requireAuth,
	[body('token').notEmpty(), body('orderId').notEmpty()],
	validateRequest,
	async (_req: Request, res: Response) => {
		return res.send('Ok');
	}
);

export { router as createChargeRouter };
