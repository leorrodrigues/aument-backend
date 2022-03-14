import mongoose from 'mongoose';
import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
@InputType('UserInput')
export default class UserType {
    @Field(() => String)
    _id: mongoose.Types.ObjectId;

    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    login: string;

    password: string;

    @Field(() => Date, { nullable: true })
    lastLogin?: Date;

    @Field(() => String)
    createdAt: Date;

    @Field(() => String)
    createdBy: string;

    @Field(() => String, { nullable: true })
    updatedAt?: Date;

    @Field(() => String, { nullable: true })
    updatedBy?: string;
}
