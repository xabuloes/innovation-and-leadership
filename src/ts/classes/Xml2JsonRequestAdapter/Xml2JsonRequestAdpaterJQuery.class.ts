import {Xml2JsonRequestAdapter} from "../../interfaces/Xml2JsonRequestAdapter/Xml2JsonRequestAdapter.interface";
import * as $ from "jquery";
import * as xml2js from "xml2js";
import {injectable} from "inversify";

@injectable()
export class Xml2JsonRequestAdpaterJQuery implements Xml2JsonRequestAdapter {

    public constructor() {
        // TODO
    }

    public ajaxRequest(ajaxSettings: JQueryAjaxSettings): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            ajaxSettings.success = (xmlData: string) => {

                const parser: xml2js.Parser = new xml2js.Parser();

                parser.parseString(xmlData, (error: any, result: any) => {

                    if (error) {
                        throw new Error("Error while parsing XML to JSON!");
                    } else {
                        resolve(result);
                    }
                });

            };

            // Fire request
            $.ajax(ajaxSettings);

        });

    }

}
