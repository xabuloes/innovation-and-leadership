import {inject, injectable} from "inversify";
import * as $ from "jquery";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {RoomDatabaseConnector} from "../../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import * as xml2js from "xml2js";
import {Contract} from "typedcontract";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";

@injectable()
export class UnivisRoomDatabaseConnector implements RoomDatabaseConnector {

    @inject("config")
    private config: ApplicationConfig;

    constructor() {
        // TODO
    }

    public getRoomData(roomId: string): Promise<RoomData[]> {
        return new Promise<RoomData[]>((resolve, reject) => {

                (new Contract()).In(roomId)
                    .isNotNull()
                    .isLengthGreaterThan("");

                const format = "xml";
                const module = "rooms";

                $.ajax({
                        method: "GET",
                        url: `${this.config.roomDatabase.host}/prg?search=${module}&name=${roomId}&show=${format}`,
                        dataType: "html",
                        success: (xmlData: string) => {
                            (new Contract()).In(xmlData)
                                .isNotNull()
                                .isLengthGreaterThan("");

                            const parser: xml2js.Parser = new xml2js.Parser();

                            parser.parseString(xmlData, (error: any, result: any) => {
                                (new Contract()).In(error).isNull();

                                const roomsFoundRawData: any[] = result.UnivIS.Room;

                                // TODO: Is this an error?
                                if (typeof roomsFoundRawData === "undefined" || roomsFoundRawData === null) {
                                    return resolve([]);
                                }

                                if (roomsFoundRawData.length <= 0) {
                                    // TODO
                                    return resolve([]);
                                }

                                console.log(roomsFoundRawData);

                                let roomsFound: RoomData[] = roomsFoundRawData.map((roomDataRaw: any) => {

                                    let hasBeamer = false,
                                        hasAudio = false,
                                        hasBoard = false,
                                        capacity = 0;

                                    if (roomDataRaw.beam && roomDataRaw.beam.indexOf("ja") !== -1) {
                                        hasBeamer = true;
                                    }

                                    if (roomDataRaw.audio && roomDataRaw.audio.indexOf("ja") !== -1) {
                                        hasAudio = true;
                                    }

                                    if (roomDataRaw.tafel && roomDataRaw.tafel.indexOf("ja") !== -1) {
                                        hasBoard = true;
                                    }

                                    if (roomDataRaw.size && roomDataRaw.size.length > 0) {
                                        capacity = Number(<string>roomDataRaw.size[0]);
                                    }

                                    const test: RoomData = {
                                        id: roomDataRaw.roomno,
                                        buildingName: roomDataRaw.famos_bauwerk,
                                        location: {
                                            latitude: 0xdeadbeef,
                                            longitude: 0xdeadbeef,
                                        },
                                        fullAddress: roomDataRaw.address,
                                        hasAudio,
                                        hasBeamer,
                                        hasBoard,
                                        description: roomDataRaw.description,
                                        capacity,
                                    };

                                    if (typeof roomDataRaw.entr_north !== "undefined" && roomDataRaw.entr_north !== null) {
                                        test.location.latitude = Number(<string>roomDataRaw.entr_north[0]);
                                    }
                                    if (typeof roomDataRaw.entr_east !== "undefined" && roomDataRaw.entr_east !== null) {
                                        test.location.longitude = Number(<string>roomDataRaw.entr_east[0]);
                                    }

                                    return test;
                                });

                                // Filter invalid room data
                                roomsFound = roomsFound.filter((roomData) => typeof roomData.id !== "undefined");
                                roomsFound = roomsFound.filter((roomData) => roomData.location.longitude !== 0xdeadbeef && roomData.location.latitude !== 0xdeadbeef);

                                return resolve(roomsFound);

                            });

                        }
                    }
                );

            }
        )
            ;
    }


}