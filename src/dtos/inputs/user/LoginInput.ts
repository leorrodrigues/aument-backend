import { Field, InputType } from 'type-graphql';

@InputType()
export default class LoginInput {
    @Field()
    login: string;

    @Field()
    password: string;
}
