import {inject, injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../../DependencyIdentifier.const";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {LectureData} from "../../../interfaces/LectureDatabase/LectureData.interface";
import {Xml2JsonRequestAdapter} from "../../../interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";
import {Contract} from "typedcontract";
import {RoomDatabaseConnector} from "../../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";

@injectable()
export class UnivisLectureDatabaseConnector implements LectureDatabaseConnector {

    private desiredFormat = "xml";

    private readonly LECTURE_TYPE: any = {
        LECTURE: "vorl",
        EXERCISE: "ue",
    };

    public constructor(@inject(DI.CONFIG) private config: ApplicationConfig,
                       @inject(DI.ROOM_DATABASE_CONNECTOR) private roomDatabaseConnector: RoomDatabaseConnector,
                       @inject(DI.XML2JSON_REQUEST_ADAPTER_SERVICE) private xml2JsonRequestAdapterService: Xml2JsonRequestAdapter) {
        // TODO

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
                    .filter((lecture: any) => typeof lecture.name !== "undefined")
                    .filter((lecture: any) => lecture.name.length > 0)
                    .filter((lecture: any) => lecture.type[0] === this.LECTURE_TYPE.LECTURE)
                    .map((lecture: any) => {

                        console.log(lecture);

                        let language = "?";

                        if (typeof lecture.leclanguage !== "undefined") {
                            switch (lecture.leclanguage[0]) {

                                case "D":
                                    language = "German";
                                    break;

                                case "E":
                                    language = "English";
                                    break;

                            }
                        }

                        /* tslint:disable */
                        const fakeRoom: RoomData = {
                            "id": "00.153",
                            "buildingName": "113 RRZE / Informatik",
                            "location": {"latitude": 49.573891, "longitude": 11.027331},
                            "fullAddress": "Martensstraße 3, 91058 Erlangen",
                            "hasAudio": false,
                            "hasBeamer": true,
                            "hasBoard": true,
                            "capacity": 20
                        };
                        /* tslint:enable */

                        return <LectureData>{
                            name: (typeof lecture.name !== "undefined") ? (lecture.name[0]) : ("Unknown Lecture"),
                            time: {
                                start: new Date(),
                                end: new Date(),
                            },
                            language,
                            room: fakeRoom,
                            guestsAreAllowed: (typeof lecture.gast !== "undefined") ? (lecture.gast[0] === "ja") : ("?"), // TODO: Put "ja" in const
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

    public getLectureDataForLocation(location: string): Promise<LectureData[]> {

        const searchFor = "lectures",
            searchPattern = "Technische Fakultaet";

        return this.xml2JsonRequestAdapterService
            .ajaxRequest({
                method: "GET",
                url: `${this.config.lectureDatabase.host}/prg?search=${searchFor}&department=${searchPattern}&show=${this.desiredFormat}`,
                dataType: "html"
            })
            .then((result: any) => {

                (new Contract()).In(result).isDefined().isNotNull();
                (new Contract()).In(result.UnivIS).isDefined().isNotNull();
                (new Contract()).In(result.UnivIS.Lecture).isDefined().isNotNull();

                const univisResults: any[] = result.UnivIS.Lecture.slice(0, 40);

                return univisResults
                    .filter((lecture: any) => lecture.name !== null)
                    .filter((lecture: any) => typeof lecture.name !== "undefined")
                    .filter((lecture: any) => lecture.name.length > 0)
                    .filter((lecture: any) => lecture.type[0] === this.LECTURE_TYPE.LECTURE)
                    .map((lecture: any) => {

                        let language = "?";

                        if (typeof lecture.leclanguage !== "undefined") {
                            switch (lecture.leclanguage[0]) {

                                case "D":
                                    language = "German";
                                    break;

                                case "E":
                                    language = "English";
                                    break;

                            }
                        }

                        /* tslint:disable */
                        const fakeRoom: RoomData = {
                            "id": "00.153",
                            "buildingName": "113 RRZE / Informatik",
                            "location": {"latitude": 49.573891, "longitude": 11.027331},
                            "fullAddress": "Martensstraße 3, 91058 Erlangen",
                            "hasAudio": false,
                            "hasBeamer": true,
                            "hasBoard": true,
                            "capacity": 20
                        };
                        /* tslint:enable */

                        // console.log(lecture);
                        return <LectureData>{
                            name: (typeof lecture.name !== "undefined") ? (lecture.name[0]) : "Unknown Lecture",
                            time: {
                                start: new Date(),
                                end: new Date(),
                            },
                            language,
                            room: fakeRoom,
                            guestsAreAllowed: (typeof lecture.gast !== "undefined") ? (lecture.gast[0] === "ja") : (true), // TODO: Put "ja" in const
                            type: "UNKNOWN",
                            topics: lecture.keywords,
                            url: (typeof lecture.url_description !== "undefined") ? (lecture.url_description[0]) : (undefined)
                        };

                    });

            });


    }

    public getLectureDataForRoom(room: RoomData): Promise<LectureData[]> {
        return Promise.resolve([]);
    }
}
