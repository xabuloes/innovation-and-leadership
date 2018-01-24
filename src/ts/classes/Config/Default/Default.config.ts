import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/ApplicationConfig.interface";

export const configDefault: ApplicationConfig = <ApplicationConfig>{

    roomDatabase: {
        host: "http://fabulo.es:8888/reverse_proxy/univis",
    }

};
