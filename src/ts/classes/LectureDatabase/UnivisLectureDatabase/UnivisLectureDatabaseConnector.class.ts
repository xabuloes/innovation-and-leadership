import {inject, injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../../DependencyIdentifier.const";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";
import {Xml2JsonRequestAdapter} from "../../../interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";
import {Contract} from "typedcontract";

@injectable()
export class UnivisLectureDatabaseConnector implements LectureDatabaseConnector {

    private desiredFormat = "xml";

    private readonly LECTURE_TYPE: any = {
        LECTURE: "vorl",
        EXERCISE: "ue",
    };

    public constructor(@inject(DI.CONFIG) private config: ApplicationConfig,
                       @inject(DI.XML2JSON_REQUEST_ADAPTER_SERVICE) private xml2JsonRequestAdapterService: Xml2JsonRequestAdapter) {
        // TODO

    }

    public getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {
        throw new Error("Not implemented yet.");
    }

    public getLectureDataForToday(searchPattern: string): Promise<LectureData[]> {

        const searchFor = "lectures";

        return this.xml2JsonRequestAdapterService
            .ajaxRequest({
                method: "GET",
                url: `${this.config.lectureDatabase.host}/prg?search=${searchFor}&name=${searchPattern}&show=${this.desiredFormat}`,
                dataType: "html"
            })
            .then((result: any) => {

                (new Contract()).In(result).isDefined().isNotNull();
                (new Contract()).In(result.UnivIS).isDefined().isNotNull();
                (new Contract()).In(result.UnivIS.Lecture).isDefined().isNotNull();

                return result.UnivIS.Lecture
                    .filter((lecture: any) => lecture.name !== null)
                    .filter((lecture: any) => lecture.name.length > 0)
                    .filter((lecture: any) => lecture.type[0] === this.LECTURE_TYPE.LECTURE)
                    .map((lecture: any) => {

                        console.log(lecture);

                        // console.log(lecture);
                        return <LectureData>{
                            name: lecture.name[0],
                            time: {
                                start: new Date(),
                                end: new Date(),
                            },
                            guestsAreAllowed: (lecture.gast[0] === "ja"), // TODO: Put "ja" in const
                            type: "UNKNOWN",
                            topics: lecture.keywords,
                            url: (typeof lecture.url_description !== "undefined") ? (lecture.url_description[0]) : (undefined)
                        };

                    });

            });

    }

    public getLectureDataForTomorrow(): Promise<LectureData[]> {
        throw new Error("Not implemented yet.");
    }

    public getLectureDataForTime(): Promise<LectureData[]> {
        throw new Error("Not implemented yet.");
    }

}
