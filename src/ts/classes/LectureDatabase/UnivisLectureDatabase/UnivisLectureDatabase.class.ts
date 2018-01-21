import {injectable} from "inversify";
import {LectureDatabaseConnector} from "../../../interfaces/LectureDatabase/LectureDatabaseConnector.interface";

@injectable()
export class UnivisLectureDatabase implements LectureDatabaseConnector {

    public constructor() {
        // TODO
    }

}
