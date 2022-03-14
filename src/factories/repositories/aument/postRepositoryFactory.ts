import PostRepository from '@/domain/repositories/aument/PostRepository';

const postRepositoryFactory = () => {
    return new PostRepository();
};

export default postRepositoryFactory;
