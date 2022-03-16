import env from '@/main/config/env';

const mapImageUrl = (posts: any[]) =>
    posts.map(post => ({
        ...post.toObject(),
        imageUrl: post.imageUrl
            ? `${env.APP_STATIC}/${post.imageUrl}`
            : undefined,
    }));

export default mapImageUrl;
