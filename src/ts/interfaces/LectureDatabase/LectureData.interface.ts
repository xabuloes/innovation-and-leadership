import {RoomData} from "../RoomDatabase/RoomData.interface";

export interface LectureData {

    name: string;

    time: {
        start: Date;
        end: Date;
    };

    room: RoomData;

}
