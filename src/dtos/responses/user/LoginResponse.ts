import { Field, ObjectType } from 'type-graphql';

@ObjectType({ simpleResolvers: true })
export default class LoginResponse {
    @Field()
    accessToken: string;
}
