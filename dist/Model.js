'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
    _createClass(Model, null, [{
        key: 'create',
        value: function create(data) {
            var model = new this();
            if (data) {
                model.set(data);
            }
            return model;
        }
    }]);

    function Model(child) {
        _classCallCheck(this, Model);

        this.data = {};
        this.id = false;
        this.description = {
            fields: child.fields,
            hidden: child.hidden
        };
        if (!this.description.fields) {
            throw new Error('A model must declare its fields as a static property');
        }
    }

    _createClass(Model, [{
        key: 'setStrict',
        value: function setStrict(flag) {
            this.description.strict = flag;
        }
    }, {
        key: 'setId',
        value: function setId(id) {
            this.id = id;
        }
    }, {
        key: 'getId',
        value: function getId(id) {
            return this.id;
        }
    }, {
        key: 'set',
        value: function set(data) {
            var _this = this;

            if (data.id !== undefined) {
                this.setId(data.id);
                delete data.id;
            }
            var newData = Object.keys(data).reduce(function (acc, passedKey) {
                if (_this.description.fields.includes(passedKey)) {
                    acc[passedKey] = data[passedKey];
                } else {
                    if (_this.description.strict) {
                        throw new Error('Attempted to set invalid key ' + passedKey + ' on Model');
                    }
                }
                return acc;
            }, {});
            this.data = Object.assign(this.data, newData);
            return this;
        }
    }, {
        key: 'get',
        value: function get(filter) {
            var _this2 = this;

            var desc = this.description;
            var keys = filter ? filter : desc.fields;
            if (!Array.isArray(keys)) return this.data[keys];
            return keys.reduce(function (acc, key) {
                if (desc.hidden && desc.hidden.includes(key)) return acc;
                acc[key] = _this2.data[key] ? _this2.data[key] : null;
                return acc;
            }, {});
        }
    }]);

    return Model;
}();

exports.default = Model;