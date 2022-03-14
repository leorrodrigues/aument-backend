import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreatePostInput {
    @Field()
    title: string;

    @Field()
    text: string;

    @Field(() => String)
    tagId: string;
}
