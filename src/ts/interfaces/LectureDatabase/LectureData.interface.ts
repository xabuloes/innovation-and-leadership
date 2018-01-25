import {RoomData} from "../RoomDatabase/RoomData.interface";

export interface LectureData {

    name: string;

    time: {
        start: Date;
        end: Date;
    };

    room: RoomData;

    type: string;

    guestsAreAllowed: boolean;

    url?: string;

    topics?: string[];

}
