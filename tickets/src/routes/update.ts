import { NotFoundError } from '@frntickets/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.put('/api/tickets/:id', async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id);
	if (!ticket) {
		throw new NotFoundError();
	}
	return res.send();
});

export { router as updateTicketRouter };
