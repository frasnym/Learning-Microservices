import { Listener, Subjects, TicketUpdatedEvent } from '@frntickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { title, price, version } = data;
		const ticket = await Ticket.findByEvent(data);
		if (!ticket) {
			return console.log('Ticket not found!');
			// throw new Error('Ticket not found!');
		}

		ticket.set({
			title,
			price,
			version,
		});
		await ticket.save();

		msg.ack();
	}
}
