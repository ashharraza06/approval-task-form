using db from '../db/schema';

service MyService {

    entity Test as projection on db.complaint;

}