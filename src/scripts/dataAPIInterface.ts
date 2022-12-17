import { blogCategoryListTestData, blogSummaryTestData, blogTagListTestData, blogTestPostData } from "../_testData";

function randomWaitFor(fromMS = 0, toMS = 1500) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, Math.floor(Math.random() * toMS + fromMS));
    })
}

function randomWaitForWithRandomError(fromMS = 0, toMS = 1500, errorRate = 0.2) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            Math.random() < errorRate ? reject(new Error('随机的模拟错误。')) : resolve();
        }, Math.floor(Math.random() * toMS + fromMS));
    })
}

type BlogPostSearchQuery = {
    author: string;
    tag: string;
    category: string;
    searchText: string;
    perPage: number;
    thisPage: number;
};

// 这里是程序直接调用的接口部分。在这里完成请求的包装变换和适配。
export class APIService {
    static requestCache: ({ [key: string]: string })[];

    static async getBlogCategoryList(): Promise<CategoryListData> {
        await randomWaitForWithRandomError();
        return blogCategoryListTestData;
    }
    static async getBlogTagList(): Promise<TagListData> {
        await randomWaitForWithRandomError();
        return blogTagListTestData;
    }

    static async getBlogSummaryList(query?: Partial<BlogPostSearchQuery> & Required<{ perPage: number; thisPage: number; }>): Promise<{ data: BlogSummaryData[]; total: number; }> {
        await randomWaitForWithRandomError();
        return {
            data: new Array<BlogSummaryData>(10).fill(blogSummaryTestData),
            total: 114
        };
    };

    static async getBlogFullDataById(id: number | string): Promise<BlogPostData> {
        await randomWaitForWithRandomError();
        return blogTestPostData;
    };

    static async loginViaUsernameAndPassword(username: string, password: string): Promise<BlogUserCore & BlogUserData> {
        await randomWaitForWithRandomError(0, 1500, 0.5);
        return {
            id: 114,
            username: '孙笑川',
            avatar: '/vite.svg',
            flags: ['ADMIN'],
            signature: '儒 雅 随 和'
        };
    };

    static async signoff(): Promise<void> {
        await randomWaitForWithRandomError();
        return;
    };

    
};