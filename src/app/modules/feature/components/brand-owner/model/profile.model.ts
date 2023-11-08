export class Profile{
    fullName?:string;
    username?:string;
    address?:string;
    email?:string;
    phone?:string;
    identityCode?:string;
}
export class ProfileCustomer{
    fullName?:string;
    email?:string;
    phone?:string;
}
export class ChangePassDTO{
    newPass?:string;
    reNewPass?:string;
}