import {EarthCoordinate} from "../EarthCoordinate.interface";

export interface RoomData {

    id: string;

    buildingName: string;

    location: EarthCoordinate;

    fullAddress?: string; // ["Kochstraße 6a, 91054 Erlangen"]

    hasAudio?: boolean; // ["ja"]

    hasBeamer?: boolean; // ["ja"]

    hasBoard?: boolean;

    description?: string; // ["PC vorhanden ** Vorbelegungsberechtigte Einrichtung (bis zum Stichtag): Phil. Fak. & FB Theologie **"]

    capacity?: number;

    // famos_Code_Raum: ["05902.00.015"]
    // famos_NGF: ["71"]
    // famos_Nutzungsart: ["523 Übungsraum"]
    // famos_Tuerschild: ["SR6"]
    // famos_bauteil: ["05902 Philosophie Seminargebäude (PSG III)"]
    // famos_bauwerk: ["059 Philosophie u. Seminarraumgebäude PSG II+III"]
    // famoslocked: ["locked"]
    // id: ["21151456"]
    // lose: ["ja"]
    // north: ["49.601019"]
    // orgname: ["Kochstraße"]
    // orgunit_ens: [{ … }]
    // orgunits: [{ … }]
    // roomno: ["00.015"]
    // short: ["00.15 PSG"]

}
