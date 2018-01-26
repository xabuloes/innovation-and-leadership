import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";
import {inject, injectable} from "inversify";
import {RoomDatabaseConnector} from "../../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";

@injectable()
export class FakeLectureDatabaseConnector implements LectureDatabaseConnector {

    public constructor(@inject("roomDatabaseConnector") private roomDatabaseConnector: RoomDatabaseConnector) {
        // TODO
    }


    getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {
        return Promise.resolve([]);
    }

    public getLectureDataForLocation(location: string): Promise<LectureData[]> {

        return this.roomDatabaseConnector.getDataForRoom("00.153")
            .then((room: RoomData) => {

                return [{
                    name: "Algorithmen & Datenstrukturen",
                    time: {
                        start: new Date("2018-02-25T15:00:00"),
                        end: new Date("2018-02-25T16:30:00"),
                    },
                    language: "?",
                    room,
                    guestsAreAllowed: false,
                    type: "",
                }];
            });

    }

    public getLectureDataForToday(searchPattern: string): Promise<LectureData[]> {

        return this.roomDatabaseConnector.getDataForRoom("00.153")
            .then((room: RoomData) => {

                return [{
                    name: "Algorithmen & Datenstrukturen",
                    time: {
                        start: new Date("2018-02-25T15:00:00"),
                        end: new Date("2018-02-25T16:30:00"),
                    },
                    language: "?",
                    room, // TODO: How to get room?
                    guestsAreAllowed: false,
                    type: ""
                }];

            });

    }

    public getLectureDataForTomorrow(): Promise<LectureData[]> {
        throw new Error("Not implemented yet.");
    }

    public getLectureDataForTime(): Promise<LectureData[]> {
        throw new Error("Not implemented yet.");
    }

}
