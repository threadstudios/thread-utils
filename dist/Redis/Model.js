'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('../');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RedisModel = function (_Model) {
    _inherits(RedisModel, _Model);

    _createClass(RedisModel, null, [{
        key: 'fromRedis',
        value: function fromRedis(data) {
            var _this2 = this;

            var entityData = Object.keys(data).reduce(function (acc, key) {
                acc[key] = _this2.jsonFields.includes(key) ? JSON.parse(data[key]) : data[key];
                return acc;
            }, {});
            return this.create(entityData);
        }
    }]);

    function RedisModel(child) {
        _classCallCheck(this, RedisModel);

        var _this = _possibleConstructorReturn(this, (RedisModel.__proto__ || Object.getPrototypeOf(RedisModel)).call(this, child));

        _this.redisDesc = {
            indices: child.indices,
            jsonFields: child.jsonFields,
            entityName: child.entityName
        };
        return _this;
    }

    _createClass(RedisModel, [{
        key: 'toRedis',
        value: function toRedis() {
            var _this3 = this;

            var rawData = this.get();
            var redisData = Object.keys(rawData).reduce(function (acc, key) {
                var data = rawData[key];
                if (_this3.redisDesc.jsonFields.includes(key)) {
                    data = JSON.stringify(rawData[key]);
                }
                acc.push(key, data);
                return acc;
            }, []);
            return redisData;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return Object.assign({}, this.get(), { id: this.getId() });
        }
    }]);

    return RedisModel;
}(_.Model);

exports.default = RedisModel;