'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repo = function () {
    function Repo(entity, redis) {
        var _this = this;

        _classCallCheck(this, Repo);

        var r = redis;
        this.r = r.client;
        this.e = entity;
        this.e.indices.forEach(function (index) {
            _this['getBy' + (index.charAt(0).toUpperCase() + index.slice(1))] = function (value) {
                return _this.getBy(index, value);
            };
        });
    }

    _createClass(Repo, [{
        key: 'getBy',
        value: function getBy(field, value) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.r.zscore([_this2.e.entityName + '.' + field, value]).then(function (resultId) {
                    if (resultId === null) return Promise.resolve({ entity: false });
                    return _this2.getById(resultId);
                }).then(function (result) {
                    return resolve({
                        state: result.entity ? 'OK' : 'NOPE',
                        entity: result.entity ? result.entity : false
                    });
                }).catch(function (err) {
                    return reject({ state: 0, err: err.message || err });
                });
            });
        }
    }, {
        key: 'getById',
        value: function getById(id) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.r.hgetall([_this3.e.entityName + ':' + id]).then(function (result) {
                    var entity = _this3.e.fromRedis(result);
                    entity.setId(id);
                    resolve({
                        state: 'OK',
                        entity: entity
                    });
                }).catch(function (err) {
                    return reject({ state: 0, err: err });
                });
            });
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.r.smembers([_this4.e.entityName + ':set']).then(function (results) {
                    _this4.r.pipeline(results.map(function (key) {
                        return ['hgetall', _this4.e.entityName + ':' + key];
                    })).exec().then(function (items) {
                        items = items.map(function (item, x) {
                            var entity = _this4.e.fromRedis(item[1]);
                            entity.setId(results[x].replace(_this4.e.entityName + ':', ''));
                            return entity;
                        });
                        resolve({
                            state: 'OK',
                            entities: items
                        });
                    });
                });
            });
        }
    }]);

    return Repo;
}();

exports.default = Repo;