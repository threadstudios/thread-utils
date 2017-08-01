export default class Model {
    static create(data) {
        const model = new this();
        if(data) { model.set(data) }
        return model;
    }
    constructor(child) {
        this.data = {};
        this.id = false;
        const fields = child.fields.concat(["deleted"]);
        this.description = {
            fields : fields,
            hidden : child.hidden
        }
        if(!this.description.fields) {
            throw new Error('A model must declare its fields as a static property');
        }
    }
    setStrict(flag) {
        this.description.strict = flag;
    }
    setId(id) {
        this.id = id;
    }
    getId(id) {
        return this.id;
    }
    set(data) {
        if(data.id !== undefined) {
            this.setId(data.id);
        }
        const newData = Object.keys(data).reduce((acc, passedKey) => {
            if(this.description.fields.includes(passedKey)){
                acc[passedKey] = data[passedKey]
            } else {
                if(this.description.strict) {
                    throw new Error(`Attempted to set invalid key ${passedKey} on Model`);
                }
            }
            return acc;
        }, {});
        this.data = Object.assign(this.data, newData);
        return this;
    }
    get(filter) {
        const desc = this.description;
        let keys = filter ? filter : desc.fields;
        if(!Array.isArray(keys)) return this.data[keys];
        return keys.reduce((acc, key) => {
            if(desc.hidden && desc.hidden.includes(key)) return acc;
            acc[key] = this.data[key] ? this.data[key] : null;
            return acc;
        }, {});
    }
}