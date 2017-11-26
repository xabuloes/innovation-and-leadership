import {Container} from "inversify";
import {FaunditApplication} from "./FaunditApplication.class";
import {GPSLocationDeterminationService} from "./classes/GPSLocationDeterminationService.class";
import {LocationDeterminationService} from "./interfaces/LocationDeterminationService.interface";
import * as THREE from "three";

import "reflect-metadata";


/**
 * Load missing three js components:
 */
declare const loadAdditionalThreeJsDependencies: Function;

loadAdditionalThreeJsDependencies(THREE);


/**
 * Create DI container and setup DI bindings
 */
const inversifyContainer: Container = new Container();

inversifyContainer.bind<LocationDeterminationService>("locationDeterminationService").to(GPSLocationDeterminationService);

/**
 * Resolve application instance (= start application)
 */
const application: FaunditApplication = inversifyContainer.resolve<FaunditApplication>(FaunditApplication);
