import Model from '../../src/Model';

class User extends Model {
    static defaults = {confirmed: false};
    static fields = ["email", "password", "firstName", "lastName", "confirmed"];
    static hidden = ["password"];
    constructor() {
        super(User);
    }
}

export default User;