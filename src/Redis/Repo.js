class Repo {
    constructor(entity, redis) {
        const r = redis
        this.r = r.client;
        this.e = entity;
        this.e.indices.forEach((index) => {
            this[`getBy${index.charAt(0).toUpperCase() + index.slice(1)}`] = (value) => {
                return this.getBy(index, value);
            }
        });
    }
    getBy(field, value) {
        return new Promise((resolve, reject) => {
            this.r.zscore([`${this.e.entityName}.${field}`, value])
            .then((resultId) => {
                if(resultId === null) return Promise.resolve({ entity: false })
                return this.getById(resultId);
            })
            .then((result) => {
                return resolve({
                    state: result.entity ? 'OK' : 'NOPE', 
                    entity: result.entity ? result.entity : false
                });
            })
            .catch((err) => {
                return reject({ state : 0, err : err.message || err });
            })
        });
    }
    getById(id) {
        return new Promise((resolve, reject) => {
            this.r.hgetall([`${this.e.entityName}:${id}`])
            .then((result) => {
                const entity = this.e.fromRedis(result);
                entity.setId(id);
                resolve({
                    state: 'OK',
                    entity: entity
                });
            })
            .catch((err) => {
                return reject({ state: 0, err : err });
            })
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            this.r.smembers([`${this.e.entityName}:set`])
            .then((results) => {
                this.r.pipeline(results.map((key) => {
                    return ['hgetall', `${this.e.entityName}:${key}`];
                })).exec()
                .then((items) => {
                    items = items.map((item, x) => {
                        const entity = this.e.fromRedis(item[1]);
                        entity.setId(results[x].replace(`${this.e.entityName}:`, ''))
                        return entity;
                    });
                    resolve({
                        state: 'OK',
                        entities: items
                    });
                })
            });
        });
    }
}

export default Repo;