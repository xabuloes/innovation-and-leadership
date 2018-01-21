import {UserProfileData} from "./UserProfileData.interface";

export interface UserProfileService {

    getUserProfileData(): Promise<UserProfileData>;

}
