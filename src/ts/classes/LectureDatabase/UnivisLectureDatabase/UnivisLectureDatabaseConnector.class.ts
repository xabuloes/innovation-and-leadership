import {inject, injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../../DependencyIdentifier.const";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";
import {Xml2JsonRequestAdapter} from "../../../interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";

@injectable()
export class UnivisLectureDatabaseConnector implements LectureDatabaseConnector {

    private desiredFormat: string = "xml";

    public constructor(@inject(DI.CONFIG) private config: ApplicationConfig,
                       @inject(DI.XML2JSON_REQUEST_ADAPTER_SERVICE) private xml2JsonRequestAdapterService: Xml2JsonRequestAdapter) {
        // TODO


    }

    public getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {

        const lectureSearchPattern = "Algo";
        const searchFor = "lectures";

        return this.xml2JsonRequestAdapterService
            .ajaxRequest({
                method: "GET",
                url: `${this.config.roomDatabase.host}/prg?search=${module}&name=${lectureSearchPattern}&show=${this.desiredFormat}`,
                dataType: "html"
            })
            .then(() => {
                // TODO
                return [];
            });

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
