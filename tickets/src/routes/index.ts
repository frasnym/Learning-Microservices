import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets', async (_req: Request, res: Response) => {
	const tickets = await Ticket.find({});

	return res.send(tickets);
});

export { router as indexTicketRouter };
