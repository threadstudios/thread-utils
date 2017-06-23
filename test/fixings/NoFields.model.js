import Model from '../../src/Model'

export default class NoFields extends Model {
    constructor() {
        super(NoFields)
    }
    test() {
        return 'Hello World';
    }
}