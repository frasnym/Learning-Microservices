import { Listener, OrderCreatedEvent, Subjects } from '@frntickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);
		if (!ticket) {
			return console.log('Ticket not found!');
		}

		ticket.orderId = data.id;
		await ticket.save();

		const publisher = new TicketUpdatedPublisher(this.client);
		await publisher.publish({
			id: ticket.id,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
		});

		msg.ack();
	}
}
