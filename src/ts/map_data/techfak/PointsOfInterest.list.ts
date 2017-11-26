import {PointOfInterest} from "../../interfaces/PointOfInterest.interface";

/**
 * A list of all points of interest from the location is exported.
 */
/* tslint:disable */
export const PointsOfInterests = <PointOfInterest[]>[
    {
        name: "Tentorium",
        description: "The tentorium is the former cafeteria of TechFak. Its open space can be used for group work.",
        location: {
            longitude: 11.028486,
            latitude: 49.573727,
        },
    },
    {
        name: "FAPS",
        description: "Chair for production systems and automatization.",
        location: {
            longitude: 11.025575,
            latitude: 49.573981,
        },
    }
];