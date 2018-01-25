import {inject, injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../../DependencyIdentifier.const";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";

@injectable()
export class UnivisLectureDatabaseConnector implements LectureDatabaseConnector {


    public constructor(@inject(DI.CONFIG) private config: ApplicationConfig) {
        // TODO
    }

    public getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {
        return Promise.resolve([]);
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
