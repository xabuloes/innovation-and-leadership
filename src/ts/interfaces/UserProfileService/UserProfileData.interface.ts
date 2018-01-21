export interface UserProfileSkill {

    label: string;

    skillRating: number;

}

export interface UserProfileData {

    username: string;

    firstName: string;

    lastName: string;

    skills: UserProfileSkill[];

}
