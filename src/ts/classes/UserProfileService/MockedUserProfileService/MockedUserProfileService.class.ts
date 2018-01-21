import {UserProfileService} from "../../../interfaces/UserProfileService/UserProfileService.interface";

export class MockedUserProfileService implements UserProfileService {

    public getUserProfileData(): Promise<UserProfileData[]> {
        return Promise.resolve(<UserProfileData>{
            username: "xe89tiru",
            firstName: "Fabian",
            lastName: "Roth",
        });
    }


}