'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = function () {
    function Mapper(redis) {
        _classCallCheck(this, Mapper);

        var r = redis;
        this.r = r.client;
    }

    _createClass(Mapper, [{
        key: 'save',
        value: function save(entity) {
            if (entity.getId()) {
                return this.update(entity);
            } else {
                return this.create(entity);
            }
        }
    }, {
        key: 'setIndices',
        value: function setIndices(state, entity, rDesc, idKey) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (state) {
                    var promises = rDesc.indices.reduce(function (acc, index) {
                        var value = entity.get(index);
                        if (!Array.isArray(value)) {
                            value = [value];
                        }
                        acc.concat(value.map(function (val) {
                            if (state === 'SET') {
                                return _this.r.zadd([idKey + '.' + index, entity.getId(), val]);
                            } else if (state === 'CLEAR') {
                                return _this.r.zrem([idKey + '.' + index], val);
                            }
                        }));
                        return acc;
                    }, []);
                    Promise.all(promises).then(function (results) {
                        return resolve(results);
                    });
                } else {
                    return reject({ state: 0, 'msg': 'REPO - cannot save item' });
                }
            });
        }
    }, {
        key: 'update',
        value: function update(entity) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var rDesc = entity.redisDesc;
                var idKey = '' + rDesc.entityName;
                _this2.r.hmset([idKey + ':' + entity.getId()].concat(_toConsumableArray(entity.toRedis()))).then(function (state) {
                    return _this2.setIndices(state ? 'SET' : false, entity, rDesc, idKey);
                }).then(function (results) {
                    return resolve({ state: 'OK', entity: entity });
                }).catch(function (err) {
                    return reject({ state: 0, err: err });
                });
            });
        }
    }, {
        key: 'delete',
        value: function _delete(entity) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var rDesc = entity.redisDesc;
                var idKey = '' + rDesc.entityName;
                entity.set({ deleted: true });
                _this3.r.hmset([idKey + ':' + entity.getId()].concat(_toConsumableArray(entity.toRedis()))).then(function (state) {
                    return _this3.r.srem([idKey + ':set', entity.getId()]);
                }).then(function (state) {
                    return _this3.setIndices(state ? 'CLEAR' : false, entity, rDesc, idKey);
                }).then(function (results) {
                    return resolve({ state: 'OK', entity: entity });
                }).catch(function (err) {
                    return reject({ state: 'NOPE', err: err });
                });
            });
        }
    }, {
        key: 'create',
        value: function create(entity) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var rDesc = entity.redisDesc;
                var idKey = '' + rDesc.entityName;
                _this4.r.incr([idKey]).then(function (id) {
                    entity.setId(id);
                    return _this4.r.hmset([idKey + ':' + id].concat(_toConsumableArray(entity.toRedis())));
                }).then(function (state) {
                    return _this4.r.sadd([idKey + ':set', entity.getId()]);
                }).then(function (state) {
                    return _this4.setIndices(state ? 'SET' : false, entity, rDesc, idKey);
                }).then(function (results) {
                    return resolve({ state: 'OK', entity: entity });
                }).catch(function (err) {
                    return reject({ state: 0, err: err });
                });
            });
        }
    }]);

    return Mapper;
}();

exports.default = Mapper;