import {UserProfileData} from "../UserProfileService/UserProfileData.interface";
import {RoomData} from "../RoomDatabase/RoomData.interface";

export interface SocialService {

    getAllUsersInRoom(room: RoomData): UserProfileData[];

}
