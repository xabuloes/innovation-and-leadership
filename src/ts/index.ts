import {Container} from "inversify";
import {FaunditApplication} from "./FaunditApplication.class";
import {GPSLocationDeterminationService} from "./classes/GPSLocationDeterminationService.class";
import {LocationDeterminationService} from "./interfaces/LocationDeterminationService.interface";
import * as THREE from "three";

import "reflect-metadata";
import {FakeLocationDeterminationService} from "./classes/FakeLocationDeterminationService.class";
import {RoomDatabaseConnector} from "./interfaces/RoomDatabase/RoomDatabaseConnector.interface";
import {UnivisRoomDatabaseConnector} from "./classes/RoomDatabase/UnivisRoomDatabase/UnivisRoomDatabaseConnector.class";


/**
 * Load missing three js components:
 */
declare const loadAdditionalThreeJsDependencies: Function;

loadAdditionalThreeJsDependencies(THREE);


/**
 * Create DI container and setup DI bindings
 */
const inversifyContainer: Container = new Container();

inversifyContainer.bind<LocationDeterminationService>("locationDeterminationService").to(FakeLocationDeterminationService);
inversifyContainer.bind<RoomDatabaseConnector>("roomDatabaseConnector").to(UnivisRoomDatabaseConnector);

/**
 * Resolve application instance (= start application)
 */
const application: FaunditApplication = inversifyContainer.resolve<FaunditApplication>(FaunditApplication);
