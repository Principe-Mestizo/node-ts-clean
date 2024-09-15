import 'dotenv/config';
import { get} from 'env-var';


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    MYSQL_URL: get('MYSQL_URL').required().asString(),

    JWT_SEED: get('JWT_SEED').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),

    SEND_EMAIL:  get('SEND_EMAIL').default('false').asBool(),

    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
}
