import TagRepository from '@/domain/repositories/aument/TagRepository';

const tagRepositoryFactory = () => {
    return new TagRepository();
};

export default tagRepositoryFactory;
