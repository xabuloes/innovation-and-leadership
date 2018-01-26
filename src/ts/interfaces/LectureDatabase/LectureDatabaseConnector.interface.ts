import {LectureData} from "./LectureData.interface";
import {RoomData} from "../RoomDatabase/RoomData.interface";

export interface LectureDatabaseConnector {

    getLectureDataForLocation(location: string): Promise<LectureData[]>;

    getLectureDataForRoom(room: RoomData): Promise<LectureData[]>;

    getLectureDataForToday(searchPattern: string): Promise<LectureData[]>;

    getLectureDataForTomorrow(): Promise<LectureData[]>;

    getLectureDataForTime(): Promise<LectureData[]>;

}
