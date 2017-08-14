class Mapper {
    constructor(redis) {
        const r = redis
        this.r = r.client;
    }
    save(entity) {
        if(entity.getId()) {
            return this.update(entity);
        } else {
            return this.create(entity);
        }
    }
    setIndices(state, entity, rDesc, idKey) {
        return new Promise((resolve, reject) => {
            if(state) {
                const promises = rDesc.indices.reduce((acc, index) => {
                    let value = entity.get(index);
                    if(!Array.isArray(value)) {
                        value = [ value ];
                    }
                    acc.concat(value.map((val) => {
                        if(state === 'SET') {
                            return this.r.zadd([`${idKey}.${index}`, entity.getId(), val])
                        } else if (state === 'CLEAR') {
                            return this.r.zrem([`${idKey}.${index}`], val);
                        }
                    }));
                    return acc;
                }, []);
                Promise.all(promises).then((results) => {
                    return resolve(results);
                });
            } else {
                return reject({ state: 0, 'msg' : 'REPO - cannot save item' });
            }
        });
    }
    update(entity) {
        return new Promise((resolve, reject) => {
            const rDesc = entity.redisDesc;
            const idKey = `${rDesc.entityName}`;
            this.r.hmset([`${idKey}:${entity.getId()}`, ...entity.toRedis()])
            .then((state) => {
                return this.setIndices(state ? 'SET' : false, entity, rDesc, idKey);
            })
            .then((results) => {
                return resolve({ state: 'OK', entity: entity });
            })
            .catch((err) => {
                return reject({ state : 0, err: err })
            })
        })
    }
    delete(entity) {
        return new Promise((resolve, reject) => {
            const rDesc = entity.redisDesc;
            const idKey = `${rDesc.entityName}`;
            entity.set({deleted: true});
            this.r.hmset([`${idKey}:${entity.getId()}`, ...entity.toRedis()])
            .then((state) => {
                return this.r.srem([`${idKey}:set`, entity.getId()])
            })
            .then((state) => {
                return this.setIndices(state ? 'CLEAR' : false, entity, rDesc, idKey);
            })
            .then((results) => {
                return resolve({state: 'OK', entity: entity});
            })
            .catch((err) => {
                return reject({ state : 'NOPE', err: err })
            })
        });
    }
    create(entity) {
        return new Promise((resolve, reject) => {
            const rDesc = entity.redisDesc;
            const idKey = `${rDesc.entityName}`;
            this.r.incr([idKey])
            .then((id) => {
                entity.setId(id);
                return this.r.hmset([`${idKey}:${id}`, ...entity.toRedis()])
            })
            .then((state) => {
                return this.r.sadd([`${idKey}:set`, entity.getId()])
            })
            .then((state) => {
                return this.setIndices(state ? 'SET' : false, entity, rDesc, idKey);
            })
            .then((results) => {
                return resolve({state: 'OK', entity: entity});
            })
            .catch((err) => {
                return reject({ state : 0, err: err })
            })
        });
    }
}

export default Mapper;