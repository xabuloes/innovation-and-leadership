import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";

export class FakeLectureDatabaseConnector implements LectureDatabaseConnector {


    public getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {
        return Promise.resolve([{
            name: "Algorithmen & Datenstrukturen",
            time: {
                start: new Date("2018-02-25T15:00:00"),
                end: new Date("2018-02-25T16:30:00"),
            },
            room
        }]);
    }

    public getLectureDataForToday(): Promise<LectureData[]> {
        return Promise.resolve([]);
    }

    public getLectureDataForTomorrow(): Promise<LectureData[]> {
        return Promise.resolve([]);
    }

    public getLectureDataForTime(): Promise<LectureData[]> {
        return Promise.resolve([]);
    }

}
