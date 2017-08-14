import { Model } from '../';

class RedisModel extends Model {
    static entityName;
    static indices;
    static fromRedis(data) {
        const entityData = Object.keys(data)
        .reduce((acc, key) => {
            acc[key] = this.jsonFields.includes(key) ? JSON.parse(data[key]) : data[key];
            return acc;
        }, {})
        return this.create(entityData);
    }
    constructor(child) {
        super(child);
        this.redisDesc = {
            indices : child.indices,
            jsonFields : child.jsonFields,
            entityName : child.entityName
        }
    }
    toRedis() {
        const rawData = this.get();
        const redisData = Object.keys(rawData).reduce((acc, key) => {
            let data = rawData[key];
            if(this.redisDesc.jsonFields.includes(key)) {
                data = JSON.stringify(rawData[key]);
            }
            acc.push(key, data);
            return acc;
        }, []);
        return redisData;
    }
    toJSON() {
        return Object.assign({}, 
            this.get(), 
            { id : this.getId() }
        );
    }
}

export default RedisModel;