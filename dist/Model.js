'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = exports.Model = function () {
    _createClass(Model, null, [{
        key: 'create',
        value: function create(data) {
            var model = new this();
            model.set(data);
            return model;
        }
    }]);

    function Model() {
        _classCallCheck(this, Model);

        if (!this.fields) {
            throw new Error('A model must declare its fields as a static property');
        }
    }

    _createClass(Model, [{
        key: 'set',
        value: function set(data) {}
    }, {
        key: 'fromData',
        value: function fromData(data) {
            var _this = this;

            Object.keys(data).forEach(function (key) {
                if (fields.includes(key)) {
                    _this[key] = data[key];
                }
            });
        }
    }]);

    return Model;
}();