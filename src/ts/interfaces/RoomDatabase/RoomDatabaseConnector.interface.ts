import {RoomData} from "./RoomData.interface";

export interface RoomDatabaseConnector {

    getRoomData(roomId: string): Promise<RoomData[]>;

}
