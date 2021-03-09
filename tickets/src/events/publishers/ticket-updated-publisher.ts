import { Publisher, Subjects, TicketUpdatedEvent } from '@frntickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
