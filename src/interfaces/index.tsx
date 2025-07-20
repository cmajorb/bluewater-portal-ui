export interface IUser {
    id: number;
    email: string;
    name: string;
    is_adult: boolean;
    is_admin: boolean;
    avatar: string;
}

export interface IProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_adult: boolean;
    is_admin: boolean;
}

export interface IFamilyMemberInfo {
  profile: IProfile;
  is_head: boolean;
}

export interface IFamily {
  id: number;
  name: string;
  members: IFamilyMemberInfo[];
}