import mongoose from 'mongoose';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
@InputType('TagInput')
export default class TagType {
    @Field(() => String)
    _id: mongoose.Types.ObjectId;

    @Field(() => String)
    name: string;

    @Field(() => String)
    createdAt: Date;

    @Field(() => String)
    createdBy: string;

    @Field(() => String, { nullable: true })
    updatedAt?: Date;

    @Field(() => String, { nullable: true })
    updatedBy?: string;
}
