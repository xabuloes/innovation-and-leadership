import {RoomData} from "./RoomData.interface";

export interface RoomDatabaseConnector {

    getDataForRoom(roomId: string): Promise<RoomData>;

    getDataForRooms(roomId: string): Promise<RoomData[]>;

}
