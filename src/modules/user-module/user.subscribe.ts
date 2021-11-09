import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { UserEntity } from './entites/user.entity';
import * as bcrypt from 'bcrypt';
import { Constants } from 'src/utils/constants';

@EventSubscriber()
export class UserSubscribe implements EntitySubscriberInterface<UserEntity> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return UserEntity;
    }

    async beforeInsert(event: InsertEvent<UserEntity>) {
        event.entity.created_at = new Date();
        event.entity.updated_at = new Date();
        event.entity.password = await bcrypt.hash(event.entity.password, Constants.SALT_OR_ROUNDS);
    }

    beforeUpdate(event: UpdateEvent<UserEntity>) {
        event.entity.updated_at = new Date();
    }
}
