type BlogPostData = {
    id: number;
    author: string;
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

type BlogSummaryData = {
    id: number;
    author: string;
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