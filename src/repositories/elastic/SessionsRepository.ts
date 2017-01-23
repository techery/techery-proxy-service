import BaseRepository from './BaseRepository';
import {Session} from '../../models/Session';

export const MODEL_TYPE_SESSION = 'session';

export default class SessionsRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_SESSION;
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public get(id: string): Promise<Session> {
        return super.get(id).then((result: Session) => {
           return new Session(result);
        });
    }
}