/* istanbul ignore file */
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ simpleResolvers: true })
export default class FileUploaded {
    @Field()
    originalName: string;

    @Field()
    uploadedName: string;

    @Field({ nullable: true })
    url?: string;

    @Field({ nullable: true })
    errorMessage?: string;
}
