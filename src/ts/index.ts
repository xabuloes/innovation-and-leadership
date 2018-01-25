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
import {DEPENDENCY_IDENTIFIER as DI} from "./DependencyIdentifier.const";
import {LectureDatabaseConnector} from "./interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {FakeLectureDatabaseConnector} from "./classes/LectureDatabase/FakeLectureDatabase/FakeLectureDatabaseConnector.class";
import {Xml2JsonRequestAdapter} from "./interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";
import {Xml2JsonRequestAdpaterJQuery} from "./classes/Xml2JsonRequestAdapter/Xml2JsonRequestAdpaterJQuery.class";

/**
 * Load missing three js components:
 */
declare const loadAdditionalThreeJsDependencies: Function;

loadAdditionalThreeJsDependencies(THREE);

/**
 * Create DI container and setup DI bindings
 */
const inversifyContainer: Container = new Container();

inversifyContainer.bind<ApplicationConfig>(DI.CONFIG).toConstantValue(configDefault);

inversifyContainer.bind<Xml2JsonRequestAdapter>(DI.XML2JSON_REQUEST_ADAPTER_SERVICE)
    .to(Xml2JsonRequestAdpaterJQuery).inSingletonScope();

inversifyContainer.bind<LocationDeterminationService>(DI.LOCATION_DETERMINATION_SERVICE)
    .to(FakeLocationDeterminationService).inSingletonScope();
inversifyContainer.bind<RoomDatabaseConnector>(DI.ROOM_DATABASE_CONNECTOR)
    .to(UnivisRoomDatabaseConnector).inSingletonScope();
inversifyContainer.bind<LectureDatabaseConnector>(DI.LECTURE_DATABASE_CONNECTOR)
    .to(FakeLectureDatabaseConnector).inSingletonScope();
inversifyContainer.bind<UserProfileService>(DI.USER_PROFILE_SERVICE)
    .to(MockedUserProfileService).inSingletonScope();

/**
 * Resolve application instance (= start application)
 */
const application: FaunditApplication = inversifyContainer.resolve<FaunditApplication>(FaunditApplication);
