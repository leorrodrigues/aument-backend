import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateUserInput {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    login: string;

    @Field(() => String)
    password: string;
}
