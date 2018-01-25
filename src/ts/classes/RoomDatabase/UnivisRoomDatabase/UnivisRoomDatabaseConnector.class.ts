import {inject, injectable} from "inversify";
import * as $ from "jquery";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {RoomDatabaseConnector} from "../../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import * as xml2js from "xml2js";
import {Contract} from "typedcontract";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../../DependencyIdentifier.const";
import {Xml2JsonRequestAdapter} from "../../../interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";

@injectable()
export class UnivisRoomDatabaseConnector implements RoomDatabaseConnector {

    private desiredFormat = "xml";

    constructor(@inject(DI.CONFIG) private config: ApplicationConfig,
                @inject(DI.XML2JSON_REQUEST_ADAPTER_SERVICE) private xml2JsonRequestAdapter: Xml2JsonRequestAdapter) {
        // TODO
    }

    public getDataForRoom(roomId: string): Promise<RoomData> {

        return this.getDataForRooms(roomId)
            .then((rooms: RoomData[]) => {

                if (rooms.length === 1) {
                    return rooms[0];
                }
                else {
                    throw new Error(`Room could not be found!`);
                }

            });
    }

    public getDataForRooms(roomId: string): Promise<RoomData[]> {
        return new Promise<RoomData[]>((resolve, reject) => {

                (new Contract()).In(roomId)
                    .isNotNull()
                    .isLengthGreaterThan("");

                const searchFor = "rooms";

                this.xml2JsonRequestAdapter.ajaxRequest(
                    {
                        method: "GET",
                        url: `${this.config.roomDatabase.host}/prg?search=${searchFor}&name=${roomId}&show=${this.desiredFormat}`,
                        dataType: "html"
                    }
                ).then((result) => {

                    const roomsFoundRawData: any[] = result.UnivIS.Room;

                    // TODO: Is this an error?
                    if (typeof roomsFoundRawData === "undefined" || roomsFoundRawData === null) {
                        return resolve([]);
                    }

                    if (roomsFoundRawData.length <= 0) {
                        // TODO
                        return resolve([]);
                    }

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
        );
    }


}