class DatabaseConfig {

    readonly HOST: string = 'localhost';
    readonly DATABASE_NAME: string = 'test-db';
    readonly PORT: string = '27018';

}

export const DB_CONFIG = new DatabaseConfig();
