import NoFields from './fixings/NoFields.model';
import User from './fixings/User.model';

describe("A data model", () => {

    it("should throw if the model has no static fields set", () => {
        expect(() => { NoFields.create() }).toThrow();
    })

    it("should be instantiable with data on create()", () => {
        const user = User.create({email : "paul@example.com"});
        const record = user.get();
        expect(record.email).toBe('paul@example.com');
    })

    it("should allow setting of data through set()", () => {
        const user = User.create();
        user.set({email : 'joe.bloggs@example.com'});
        expect(user.get('email')).toBe('joe.bloggs@example.com');
    });

    it("should allow me to retrieve data in several ways through get()", () => {
        const user = User.create({
            email: 'paul@example.com',
            firstName: 'Paul',
            lastName: 'Westerdale'
        });

        expect(user.get('firstName')).toBe('Paul');
        let { lastName, email } = user.get(['lastName', 'email']);
        expect(lastName).toBe('Westerdale');
        expect(email).toBe('paul@example.com');
    });

    it("should silently take the id parameter from set", () => {
        const user = User.create({
            email: 'paul@example.com',
            firstName: 'Paul',
            lastName: 'Westerdale',
            id: 12
        });
        expect(user.getId()).toBe(12);
    });

    it("should have a deleted field from the core Model", () => {
        const user = User.create({
            email: 'paul@example.com',
            firstName: 'Paul',
            lastName : 'Westerdale',
            id: 11
        });
        user.set({deleted: true});
        expect(user.get('deleted')).toBe(true);
    })

    it("should take defaults set on the core Model", () => {
        const user = User.create({
            email: 'paul@example.com',
            firstName: 'Paul',
            lastName: 'Westerdale'
        });

        expect(user.get('confirmed')).toBe(false);

        const user2 = User.create({
            email: 'paul2@example.com',
            firstName: 'Paul',
            lastName: 'Westerdale',
            confirmed: true
        });
        
        expect(user2.get('confirmed')).toBe(true);

    })

});