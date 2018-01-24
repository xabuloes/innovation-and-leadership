import {Container} from "inversify";
import {FaunditApplication} from "./FaunditApplication.class";
import {GPSLocationDeterminationService} from "./classes/LocationDeterminationService/GPSLocationDeterminationService.class";
import {LocationDeterminationService} from "./interfaces/LocationDeterminationService/LocationDeterminationService.interface";
import * as THREE from "three";

import "reflect-metadata";
import {FakeLocationDeterminationService} from "./classes/LocationDeterminationService/FakeLocationDeterminationService.class";
import {RoomDatabaseConnector} from "./interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import {UnivisRoomDatabaseConnector} from "./classes/RoomDatabase/UnivisRoomDatabase/UnivisRoomDatabaseConnector.class";
import {UserProfileService} from "./interfaces/UserProfileService/UserProfileService.interface";
import {MockedUserProfileService} from "./classes/UserProfileService/MockedUserProfileService/MockedUserProfileService.class";
import {configDefault} from "./classes/Config/Default/Default.config";
import {ApplicationConfig} from "./interfaces/ApplicationConfig/ApplicationConfig.interface";


/**
 * Load missing three js components:
 */
declare const loadAdditionalThreeJsDependencies: Function;

loadAdditionalThreeJsDependencies(THREE);


/**
 * Create DI container and setup DI bindings
 */
const inversifyContainer: Container = new Container();

inversifyContainer.bind<ApplicationConfig>("config").toConstantValue(configDefault);

inversifyContainer.bind<LocationDeterminationService>("locationDeterminationService").to(FakeLocationDeterminationService);
inversifyContainer.bind<RoomDatabaseConnector>("roomDatabaseConnector").to(UnivisRoomDatabaseConnector);
inversifyContainer.bind<UserProfileService>("userProfileService").to(MockedUserProfileService);

/**
 * Resolve application instance (= start application)
 */
const application: FaunditApplication = inversifyContainer.resolve<FaunditApplication>(FaunditApplication);
