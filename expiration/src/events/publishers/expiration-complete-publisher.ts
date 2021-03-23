import {
	ExpirationCompleteEvent,
	Publisher,
	Subjects,
} from '@frntickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
