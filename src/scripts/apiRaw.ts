// const API_URL = import.meta.env.DEV ? `/api` : '/';
const API_URL = '/api';

const abortController = {
    get signal() {
        let controller = new AbortController();
        setTimeout(() => {
            controller.abort();
        }, 16 * 1000);
        return controller.signal;
    }
};

export async function blogUserRegister(username: string, password: string, code: string, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, code }),
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return json.data;
}

export async function blogLogin(username: string, password: string, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return json.data;
}

export async function blogCheckCurrentUser(signal = abortController.signal): Promise<null | (BlogUserCore & BlogUserData)> {
    let res = await fetch(`${API_URL}/user`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (!('code' in json)) {
        throw new Error(json?.message || '服务端响应异常');
    }

    if (json.code !== 'ok' || !json.data) {
        // 未登录
        return null;
    }

    const templateUserObject: BlogUserCore & BlogUserData = {
        id: (+json.data?.id) || -1,
        flags: Array.isArray(json.data.flags) ? json.data.flags : [],
        avatar: (json.data?.avatar) || '/vite.svg',
        signature: json.data?.signature || '',
        username: json.data.username || '用户'
    };

    return templateUserObject;
}

export async function updateProfile(data: Partial<{ username: string; password: string; signature: string; }>, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/user`, {
        credentials: 'include',
        signal,
        method: 'PUT',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }
    return {
        id: (+json.data?.id) || -1,
        flags: Array.isArray(json.data.flags) ? json.data.flags : [],
        avatar: (json.data?.avatar) || '/vite.svg',
        signature: json.data?.signature || '',
        username: json.data.username || '用户'
    };
}

export async function updateAvatar(file: File, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/user/avatar`, {
        method: 'PUT',
        credentials: 'include',
        body: file,
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return json.data + '';
}

export async function getUserProfileViaUsername(username: string, signal = abortController.signal): Promise<BlogUserCore & BlogUserData> {
    let res = await fetch(`${API_URL}/user/profile/${encodeURI(username)}`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (!('code' in json) || json.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    if (!json.data) throw new Error('不存在的用户');
    return {
        id: (+json.data?.id) || -1,
        flags: Array.isArray(json.data.flags) ? json.data.flags : [],
        avatar: (json.data?.avatar) || '/vite.svg',
        signature: json.data?.signature || '',
        username: json.data.username || '用户'
    };
}

export async function blogSignOff(signal = abortController.signal) {
    let res = await fetch(`${API_URL}/user/signoff`, {
        method: 'POST',
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return null;
}

export async function getBlogDetail(id: number, signal = abortController.signal): Promise<BlogPostData> {
    let res = await fetch(`${API_URL}/blog/id/${id}`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    let rawData = json.data;


    if (!rawData) {
        throw new Error('此编号的文章不存在。');
    }

    return {
        id: rawData.id,
        author: rawData.authorProfile?.username || '',
        authorId: rawData.authorId || -1,
        summary: rawData.summary || '',
        category: rawData.category || '',
        allowComment: !!rawData.allowComment,
        content: rawData.content || '',
        createdAt: new Date((rawData.createdAt || Date.now())),
        lastModified: new Date((rawData.lastModified || rawData.lastModified || Date.now())),
        tags: Array.isArray(rawData.tags) ? rawData.tags : [],
        title: rawData.title || '无标题'
    };
}

export async function blogGetCategoryList(signal = abortController.signal): Promise<CategoryListData> {
    let res = await fetch(`${API_URL}/blog/records/categories`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    if (!Array.isArray(json?.data)) {
        throw new Error('服务端响应异常');
    }

    let rawData = json.data;

    let data: CategoryListData = [];

    for (const i of rawData) {
        data.push({
            name: i.name + '',
            postsCount: +i.postCount
        });
    }

    return data;
}

export async function blogGetTagList(signal = abortController.signal): Promise<TagListData> {
    let res = await fetch(`${API_URL}/blog/records/tags`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    if (!Array.isArray(json?.data)) {
        throw new Error('服务端响应异常');
    }

    let rawData = json.data;

    let data: TagListData = [];

    for (const i of rawData) {
        data.push({
            name: i.name + '',
            postsCount: +i.postCount
        });
    }

    return data;
}

export async function uploadImage(file: File, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/blog/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: file,
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return json.data + '';
}

export async function getPostsWithPage(page: number, perpage: number, additionalSearchQuery?: string, signal = abortController.signal):
    Promise<{ data: BlogSummaryData[], total: number }> {
    let res = await fetch(`${API_URL}/blog/search?page=${page}&page_size=${perpage}${additionalSearchQuery ? additionalSearchQuery : ''
        }`, {
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    let rawData = json.data;


    let data: BlogSummaryData[] = [];

    for (const i of rawData.blogList) {
        data.push({
            id: i.id,
            author: i.authorProfile?.username || '',
            authorId: i.authorId || -1,
            summary: i.summary || '',
            category: i.category || '',
            createdAt: new Date((i.createdAt || Date.now())),
            tags: Array.isArray(i.tags) ? i.tags : [],
            title: i.title || '无标题'
        });
    }

    return {
        data,
        total: +rawData.total
    };
}

export async function postNewBlog(article: BlogPostEditorData, signal = abortController.signal): Promise<BlogPostData> {

    let res = await fetch(`${API_URL}/blog`, {
        credentials: 'include',
        signal,
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(article)
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return json.data;
}
export async function updateBlog(article: BlogPostEditorData & { id: number }, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/blog`, {
        credentials: 'include',
        signal,
        method: 'PUT',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(article)
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return article.id;
}

export async function deleteBlog(id: number, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/blog`, {
        method: 'DELETE',
        credentials: 'include',
        signal,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ id })
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return;
}

export async function postComment(content: string, toBlogId: number, replyToCommentId?: number, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/comment`, {
        credentials: 'include',
        signal,
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            content,
            toBlogId,
            replyToCommentId
        })
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return;
}

export async function deleteComment(commentId: number, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/comment`, {
        credentials: 'include',
        signal,
        method: 'DELETE',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            id: commentId,
        })
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return;
}

export async function adminPassComment(commentId: number, undo = false, signal = abortController.signal) {
    let res = await fetch(`${API_URL}/comment/validate`, {
        credentials: 'include',
        signal,
        method: 'PUT',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            id: commentId,
            undo
        })
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    return;
}

export async function getValidatedCommentList(page: number, perPage: number, signal = abortController.signal)
    : Promise<{
        data: BlogComment[],
        total: number
    }> {
    let res = await fetch(`${API_URL}/comment/search?page=${page}&page_size=${perPage}`, {
        method: 'GET',
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    let rawData = json.data;

    let data: BlogComment[] = [];

    for (const raw of rawData.commentList) {
        data.push({
            id: raw.id,
            blogId: raw.blogId,
            content: raw.content,
            replyTo: raw.replyTo,
            time: new Date(raw.createdAt),
            user: {
                avatar: raw.userProfile.avatar || '/vite.svg',
                signature: raw.userProfile.signature || '',
                username: raw.userProfile.username || '未知用户'
            },
            replyTarget: raw.replyTarget ? ({
                id: raw.replyTarget.id,
                blogId: raw.replyTarget.blogId,
                content: raw.replyTarget.content,
                replyTo: raw.replyTarget.replyTo,
                time: new Date(raw.replyTarget.createdAt),
                user: {
                    avatar: raw.replyTarget?.userProfile?.avatar || '/vite.svg',
                    signature: raw.replyTarget?.userProfile?.signature || '',
                    username: raw.replyTarget?.userProfile?.username || '未知用户'
                },
            }) : undefined
        });
    }
    return {
        data,
        total: rawData.total
    }
}


export function parseFullUrl(path: string) {
    let full = `${API_URL}/${path}`;
    return full;
}

export async function getCommentForBlog(blogId: number | string, page: number, perPage: number, signal = abortController.signal)
    : Promise<{
        data: BlogComment[],
        total: number
    }> {
    let res = await fetch(`${API_URL}/comment/search?blog_id=${blogId}&page=${page}&page_size=${perPage}`, {
        method: 'GET',
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    let rawData = json.data;

    let data: BlogComment[] = [];

    for (const raw of rawData.commentList) {
        data.push({
            id: raw.id,
            blogId: raw.blogId,
            content: raw.content,
            replyTo: raw.replyTo,
            time: new Date(raw.createdAt),
            user: {
                avatar: raw.userProfile.avatar || '/vite.svg',
                signature: raw.userProfile.signature || '',
                username: raw.userProfile.username || '未知用户'
            },
            replyTarget: raw.replyTarget ? ({
                id: raw.replyTarget.id,
                blogId: raw.replyTarget.blogId,
                content: raw.replyTarget.content,
                replyTo: raw.replyTarget.replyTo,
                time: new Date(raw.replyTarget.createdAt),
                user: {
                    avatar: raw.replyTarget?.userProfile?.avatar || '/vite.svg',
                    signature: raw.replyTarget?.userProfile?.signature || '',
                    username: raw.replyTarget?.userProfile?.username || '未知用户'
                },
            }) : undefined
        });
    }
    return {
        data,
        total: rawData.total
    }
}

export async function getUnexaminedComment(page: number, perPage: number, signal = abortController.signal)
    : Promise<{
        data: BlogComment[],
        total: number
    }> {
    let res = await fetch(`${API_URL}/comment/search?page=${page}&page_size=${perPage}&admin=1`, {
        method: 'GET',
        credentials: 'include',
        signal
    });

    if (!res.ok) {
        throw new Error(res.statusText || res.status + '');
    }

    let json = await res.json();

    if (json?.code !== 'ok') {
        throw new Error(json?.message || '服务端响应异常');
    }

    let rawData = json.data;

    let data: BlogComment[] = [];

    for (const raw of rawData.commentList) {
        data.push({
            id: raw.id,
            blogId: raw.blogId,
            content: raw.content,
            replyTo: raw.replyTo,
            time: new Date(raw.createdAt),
            user: {
                avatar: raw.userProfile.avatar || '/vite.svg',
                signature: raw.userProfile.signature || '',
                username: raw.userProfile.username || '未知用户'
            },
            replyTarget: raw.replyTarget ? ({
                id: raw.replyTarget.id,
                blogId: raw.replyTarget.blogId,
                content: raw.replyTarget.content,
                replyTo: raw.replyTarget.replyTo,
                time: new Date(raw.replyTarget.createdAt),
                user: {
                    avatar: raw.replyTarget?.userProfile?.avatar || '/vite.svg',
                    signature: raw.replyTarget?.userProfile?.signature || '',
                    username: raw.replyTarget?.userProfile?.username || '未知用户'
                },
            }) : undefined
        });
    }
    return {
        data,
        total: rawData.total
    }
}




