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
    user: blogUserContextBase,
    set: () => { throw new Error('Not implemented.') },
    init: () => { throw new Error('Not implemented.') }
});

export function UserContextProvider({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<BlogUserContext>('Not Login');

    const set = useCallback((data: Partial<BlogUserContext> | (string & BlogUserContext)) => {
        if (typeof data === 'string') {
            setUser(data);
            return;
        }
        setUser((prev) => {
            if (typeof prev === 'string') {
                return {
                    ...blogUserContextBase,
                    ...data
                };
            }
            return {
                ...blogUserContextBase,
                ...prev,
            }
        });
    }, []);

    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<Error | null>(null);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const onSuccess = useCallback((data: null | (BlogUserCore & BlogUserData)) => {
        if (data === null) {
            setUser('Not Login');
            return;
        }
        setUser(() => {
            let userObject = {
                ...blogUserContextBase,
                ...data
            };
            if (userObject.id < 0) {
                return 'Not Login';
            }
            return userObject;
        });
    }, []);

    const onError = useCallback((err: Error) => {
        setMsg(`验证登录状态时出错: ${err.message}`);
        setNotificationOpen(true);
    }, []);

    const fireOnce = useAsync(APIService.checkCurrentUser, onSuccess, onError);

    const init = useCallback(() => {
        setUser('Not Login');
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

