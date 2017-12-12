import {injectable} from "inversify";
import * as $ from "jquery";
import {RoomData} from "../../../interfaces/RoomDatabase/RoomData.interface";
import {RoomDatabaseConnector} from "../../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import * as xml2js from "xml2js";
import {Contract} from "typedcontract";

@injectable()
export class UnivisRoomDatabaseConnector implements RoomDatabaseConnector {

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
                url: `http://univis.uni-erlangen.de/prg?search=${module}&name=${roomId}&show=${format}`,
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

                        let roomsFound: RoomData[] = roomsFoundRawData.map((roomDataRaw: any) => {
                            return {
                                id: roomDataRaw.roomno,
                                buildingName: roomDataRaw.famos_bauwerk,
                                location: {
                                    latitude: Number(<string>roomDataRaw.entr_north[0]),
                                    longitude: Number(<string>roomDataRaw.entr_east[0]),
                                }
                            };
                        });

                        // Filter invalid room data
                        roomsFound = roomsFound.filter((roomData) => typeof roomData.id !== "undefined");

                        return resolve(roomsFound);

                    });

                }
            });

        });
    }


}