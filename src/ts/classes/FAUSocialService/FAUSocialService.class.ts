import {SocialService} from "../../interfaces/SocialService/SocialService.interface";
import {RoomDatabaseConnector} from "../../interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import {DEPENDENCY_IDENTIFIER as DI} from "../../DependencyIdentifier.const";
import {inject, injectable} from "inversify";
import {RoomData} from "../../interfaces/RoomDatabase/RoomData.interface";
import {UserProfileData} from "../../interfaces/UserProfileService/UserProfileData.interface";

@injectable()
export class FAUSocialService implements SocialService {

    private peopleInRooms: any = {
        "00.001": <UserProfileData[]>[{
            firstName: "Thomas",
            lastName: "Müller",
            skills: [],
            username: "cr12teni"
        }, {
            firstName: "Annika",
            lastName: "Hansen",
            skills: [],
            username: "zq56olia"
        }]
    };

    public constructor(@inject(DI.ROOM_DATABASE_CONNECTOR) private roomDatabaseConnector: RoomDatabaseConnector) {
        // TODO
    }

    public getAllUsersInRoom(room: RoomData): UserProfileData[] {

        const users: UserProfileData[] = this.peopleInRooms[room.id] || [];

        return users;
    }
}