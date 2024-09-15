import { regularExps } from "../../../config/regular-exp";



export class RegisterUserDto {

    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    
    ){}


    static create( object:  {[key:string]:any}): [string?, RegisterUserDto?] {
        const { name, email, password} = object;

        if (!name) return ['Missing name', undefined]
        if (!email) return ['Missing name', undefined]
        if (!regularExps.email.test( email )) return ['Email is not valid']

        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password to short'];

        return [undefined, new RegisterUserDto(name, email, password)];
    }
}