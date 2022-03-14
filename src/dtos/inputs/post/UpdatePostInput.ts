import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdatePostInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    text?: string;

    @Field(() => String, { nullable: true })
    tagId?: string;
}
