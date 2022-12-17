import { createContext, useCallback, useState } from "react";

const blogUserContextBase: Exclude<BlogUserContext, string> = {
    id: -1,
    flags: [],
    username: '',
    avatar: '/vite.svg',
    signature: '',
};

export const blogUserContext = createContext<{
    user: BlogUserContext,
    set: (data: Partial<BlogUserContext> | (string & BlogUserContext)) => void
}>({
    user: blogUserContextBase,
    set: () => { }
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

    return <blogUserContext.Provider value={{ user, set }}>
        {children}
    </blogUserContext.Provider>
}

