import { ConnectionOptions } from 'typeorm';

const dbConfig: ConnectionOptions = {
    type: 'sqlite',
    database: 'data/sp_dev',
    synchronize: false,
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/src/db/migrations/*.js']
    // cli: {
    //     migrationsDir: 'src/db/migrations'
    // }
};

export default dbConfig;
