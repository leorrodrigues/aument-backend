import mongoose from 'mongoose';
import { ObjectType, Field, InputType } from 'type-graphql';

import TagType from '../Tag/TagType';

@ObjectType()
@InputType('PostInput')
export default class PostType {
    @Field(() => String)
    _id: mongoose.Types.ObjectId;

    @Field(() => String)
    title: string;

    @Field(() => String)
    text: string;

    @Field(() => String, { nullable: true })
    imageUrl?: string;

    @Field(() => TagType)
    tag: TagType;

    @Field(() => String)
    createdAt: Date;

    @Field(() => String)
    createdBy: string;

    @Field(() => String, { nullable: true })
    updatedAt?: Date;

    @Field(() => String, { nullable: true })
    updatedBy?: string;
}
