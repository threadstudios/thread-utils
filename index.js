const Model = require('./dist/Model');
const Redis = require('./dist/Redis/Redis');
const RedisModel = require('./dist/Redis/Model');
const RedisMapper = require('./dist/Redis/Mapper');
const RedisRepo = require('./dist/Redis/Repo');

module.exports = {
    Model : Model.default,
    Redis : Redis.default,
    RedisModel : RedisModel.default,
    RedisMapper : RedisMapper.default,
    RedisRepo : RedisRepo.default
}