import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateTagInput {
    @Field()
    name: string;
}
