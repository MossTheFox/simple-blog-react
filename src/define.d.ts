type BlogPostData = {
    id: number;
    author: string;
    authorId: number;
    summary: string;
    title: string;
    /** Markdown content */
    content: string;
    category: string;
    tags: string[];
    allowComment: boolean;
    // deleted
    createdAt: Date;
    lastModified: Date;
};

type BlogPostEditorData = Omit<BlogPostData, keyof {
    id: number;
    author: string;
    authorId: number;
    createdAt: Date;
    lastModified: Date;
}>;

type BlogSummaryData = {
    id: number;
    author: string;
    authorId: number;
    summary: string;
    title: string;
    category: string;
    tags: string[];
    createdAt: Date;
    // lastModified: Date;
};

type CategoryRecord = {
    name: string;
    postsCount: numnber;
};

type CategoryListData = CategoryRecord[];

type TagRecord = {
    name: string;
    postsCount: numnber;
};

type TagListData = TagRecord[];

type BlogUserCore = {
    id: number;
    // 用户权限标记
    flags: string[];
};

type BlogUserData = {
    username: string;
    avatar: string;
    signature: string;
};

type BlogUserContext = 'Not Login' | (BlogUserCore & BlogUserData);