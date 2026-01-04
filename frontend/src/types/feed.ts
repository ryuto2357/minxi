export type FeedItem = {
    kind: "content" | "post";
    likedByMe: boolean;
    pinnedByMe: boolean;
    likes: undefined;
    pins: undefined;
    _count: {
        comments: number;
        likes: number;
        pins: number;
        reports: number;
    };
    creator: {
        id: number;
        username: string;
        profilePicture: string | null;
    };
    media: {
        id: number;
        contentId: number;
        mediaUrl: string;
        mediaType: "image" | "video";
    }[];
    createdAt: Date;
    id: number;
    areaId: number;
    title: string;
    description: string;
    type: "image" | "video";
    isPrivate: boolean;
    status: "PUBLISHED" | "DRAFT";
    thumbnail: string | null;
    viewCount: number;
    popularity: number;
    creatorId: number;
} | {
    kind: "content" | "post";
    creator: {
        createdAt: Date;
        id: number;
        areaId: number;
        username: string;
        passwordHash: string;
        profilePicture: string | null;
        bio: string | null;
        updatedAt: Date;
        refreshToken: string | null;
    };
    _count: {
        comments: number;
        likes: number;
        pins: number;
    };
    title: string;
    description: string;
    isPrivate: boolean;
    status: "PUBLISHED" | "DRAFT";
    viewCount: number;
    popularity: number;
    createdAt: Date;
    id: number;
    creatorId: number;
    areaId: number;
    publishedAt: Date | null;
    parentId: number | null;
};