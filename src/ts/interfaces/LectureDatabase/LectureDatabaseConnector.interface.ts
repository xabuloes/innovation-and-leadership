import {LectureData} from "./LectureData.interface";
import {RoomData} from "../RoomDatabase/RoomData.interface";

export interface LectureDatabaseConnector {

    getLectureDataForRoom(room: RoomData): Promise<LectureData[]>;

    getLectureDataForToday(): Promise<LectureData[]>;

    getLectureDataForTomorrow(): Promise<LectureData[]>;

    getLectureDataForTime(): Promise<LectureData[]>;

}
