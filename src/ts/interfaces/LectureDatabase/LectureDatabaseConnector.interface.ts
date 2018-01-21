import {LectureData} from "./LectureDatabase.interface";

export interface LectureDatabaseConnector {

    getLectureDataForRoom(room: RoomData): Promise<LectureData[]>;

    getLectureDataForToday(): Promise<LectureData[]>;

    getLectureDataForTomorrow(): Promise<LectureData[]>;

    getLectureDataForTime(): Promise<LectureData[]>;

}
