export interface RoomDatabaseConfig {
    host: string;
}

export interface LectureDatabaseConfig {
    host: string;
}

export interface ApplicationConfig {

    roomDatabase: RoomDatabaseConfig;

    lectureDatabase: LectureDatabaseConfig;
}
