import { requireAuth } from '@frntickets/common';
import { Request, Response, Router } from 'express';

const router = Router();

router.post('/api/tickets', requireAuth, (_req: Request, res: Response) => {
	return res.sendStatus(200);
});

export { router as createTicketRouter };
