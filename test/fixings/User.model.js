import Model from '../../src/Model';

class User extends Model {
    static fields = ["email", "password", "firstName", "lastName"];
    static hidden = ["password"];
    constructor() {
        super(User);
    }
}

export default User;