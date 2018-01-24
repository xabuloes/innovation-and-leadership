import {inject, injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";
import {ApplicationConfig} from "../../../interfaces/ApplicationConfig/AppConfig.interface";

@injectable()
export class UnivisLectureDatabase implements LectureDatabaseConnector {

    @inject("config")
    private config: ApplicationConfig;

    public constructor() {
        // TODO
    }

}
