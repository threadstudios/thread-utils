import Redis from 'ioredis';

class RedisDriver {
    constructor() {
        this.client = new Redis({
            port: process.env.REDIS_PORT || 6379,
            host: process.env.REDIS_HOST || '127.0.0.1',
            password: process.env.REDIS_AUTH || "",
            db: process.env.REDIS_DB || 0
        });
    }
    disconnect() {
        return this.client.disconnect();
    }
}

export default RedisDriver;