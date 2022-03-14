import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateUserInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    password?: string;

    @Field(() => String, { nullable: true })
    newPassword?: string;

    @Field(() => String, { nullable: true })
    newPasswordConfirmation?: string;
}
