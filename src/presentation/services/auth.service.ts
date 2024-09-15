import { bcryptAdapter, envs, JWTAdapter } from "../../config";
import { prisma } from "../../data/mysql";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    constructor(
        private readonly emailService :EmailService
    ) {}

    public async registerUser(regiserUserDto: RegisterUserDto) {


        const existUser = await prisma.user.findUnique({
            where: { email: regiserUserDto.email },
        })
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {

            // encriptar la contraseña

           const  hashedPassword = bcryptAdapter.hash(regiserUserDto.password);

            const user = await prisma.user.create({
                data: {
                    ...regiserUserDto,
                    password: hashedPassword,
                }
            });

            // jwt del usuario
            const token = await JWTAdapter.generateToken({id: user.id });

            if(!token)  throw CustomError.internalServe('Error wile creating JWT')

            // email de confirmacion   
            await this.sendEmailValidationLink( user.email );

            const { password, ...userEntity} = UserEntity.fromObject(user);

            return {
                msg: true,
                user: userEntity,
                token: token
            }

            // return user;


        } catch (error) {
            throw CustomError.internalServe(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDto){

        const user = await prisma.user.findUnique({
            where: { email: loginUserDto.email },
        })

        if (!user) throw CustomError.badRequest('Password no validos');


        const isMatch = bcryptAdapter.compare( loginUserDto.password, user.password);
        if(!isMatch) throw CustomError.badRequest('User and Password is not valid');


        const {password, ...userEntity} = UserEntity.fromObject( user);


        const token = await JWTAdapter.generateToken({id: user.id });

        if(!token)  throw CustomError.internalServe('Error wile creating JWT')


        return {
            user: userEntity,
            token: token
        }

    }

    private sendEmailValidationLink = async(email:string) => {

        const token = await JWTAdapter.generateToken({email});
        if(!token) throw CustomError.internalServe('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following to validate your email</p>
            <a href="${ link }"> Validate your email </a>
        `


        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSet = await this.emailService.sendEmail( options );
        if(!isSet) throw CustomError.internalServe('Error sending email');

        return true;

    }

    public validateEmail = async(token:string ) => {

        const payload = await JWTAdapter.validateToken( token );
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const {email} = payload as  { email:string};
        if(!email) throw CustomError.internalServe('Email not in token');

        const user = await prisma.user.findUnique({
            where: {email: email}
        });

        if(!user) throw CustomError.badRequest('User not found uwunt');


        await prisma.user.update({
            where: { email: email},
            data:  {emailValidated: true}
        })

        return true;

    }
}