import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateTagInput {
    @Field({ nullable: true })
    name?: string;
}
