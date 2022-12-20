import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useEffect, useState } from "react";
import useAsync from "../hooks/useAsync";
import { APIService } from "../scripts/dataAPIInterface";

const blogUserContextBase: Exclude<BlogUserContext, string> = {
    id: -1,
    flags: [],
    username: '',
    avatar: '/vite.svg',
    signature: '',
};

const pendingBlogUserContextBase: Exclude<BlogUserContext, string> = {
    id: -1,
    flags: [],
    username: '请稍等一下...',
    avatar: '/vite.svg',
    signature: '',
};


export const blogUserContext = createContext<{
    user: BlogUserContext;
    set: (data: Partial<BlogUserContext> | (string & BlogUserContext)) => void;
    init: () => void;
}>({
    user: 'Not Login',
    set: () => { throw new Error('用户全局上下文异常 (blogUserContext ERROR)') },
    init: () => { throw new Error('用户全局上下文异常 (blogUserContext ERROR)') }
});

// 本地缓存状态
const localSaved: BlogUserContext = (() => {
    try {
        let data = localStorage.getItem('user-data-cache');
        if (!data) return 'Not Login';
        let parsed = JSON.parse(data);
        if (!parsed || typeof parsed !== 'object') return 'Not Login';
        if (
            typeof parsed.id !== 'number'
            || !Array.isArray(parsed.flags)
            || typeof parsed.username !== 'string'
            || typeof parsed.avatar !== 'string'
            || typeof parsed.signature !== 'string'
        ) return 'Not Login';
        return {
            ...blogUserContextBase,
            ...parsed
        }
    } catch (err) {
        return 'Not Login';
    }
})();


export function UserContextProvider({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<BlogUserContext>(localSaved);

    const set = useCallback((data: Partial<BlogUserContext> | (string & BlogUserContext), appendToCache = true) => {
        if (typeof data === 'string') {
            localStorage && localStorage.removeItem('user-data-cache');
            setUser(data);
            return;
        }
        setUser((prev) => {
            if (typeof prev === 'string') {
                const userObject = {
                    ...blogUserContextBase,
                    ...data
                };
                localStorage && localStorage.setItem('user-data-cache', JSON.stringify(userObject));

                return userObject;
            }
            const userObject = {
                ...blogUserContextBase,
                ...prev,
                ...data
            };
            localStorage && localStorage.setItem('user-data-cache', JSON.stringify(userObject));
            return userObject;
        });
    }, []);

    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<Error | null>(null);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const onSuccess = useCallback((data: null | (BlogUserCore & BlogUserData)) => {
        if (data === null) {
            localStorage && localStorage.removeItem('user-data-cache');
            setUser('Not Login');
            return;
        }
        setUser(() => {
            let userObject = {
                ...blogUserContextBase,
                ...data
            };
            if (userObject.id < 0) {
                localStorage && localStorage.removeItem('user-data-cache');
                return 'Not Login';
            }
            // 保存
            localStorage && localStorage.setItem('user-data-cache', JSON.stringify(userObject));
            return userObject;
        });
    }, []);

    const onError = useCallback((err: Error) => {
        setMsg(`验证登录状态时出错: ${err.message}`);
        setNotificationOpen(true);
    }, []);

    const fireOnce = useAsync(APIService.checkCurrentUser, onSuccess, onError);

    const init = useCallback(() => {
        fireOnce();
    }, []);

    useEffect(() => {
        init();
    }, []);

    return <blogUserContext.Provider value={{ user, set, init }}>
        {children}
        <Snackbar open={notificationOpen} autoHideDuration={8000} onClose={() => setNotificationOpen(false)}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}>
            <Alert severity="error" variant="filled">{msg}</Alert>
        </Snackbar>
    </blogUserContext.Provider>
}

