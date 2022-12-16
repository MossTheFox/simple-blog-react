import { useCallback, useEffect, useState } from "react";

/**
 * 负责处理异步函数的 Hook, 参考自 https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
 * (现在是一个祖传工具函数…… 你会在 app.mxowl.com 的很多地方都见到这个家伙)
 * @param asyncFunc 异步函数，不允许更新 state
 * @param onSuccess 成功后的回调，可以更新 state，但必须不被更新 (否则触发 rerender)
 * @param onError 失败后的回调，可以更新 state，但必须不被更新
 * @param fireOnMount 是否直接就开始执行，手动触发设为 false
 * @param abortSeconds 超时时间，默认为 10 秒
 * @returns 触发一次动作
 */
function useAsync<T>(
    asyncFunc: (signal?: (AbortSignal)) => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
    fireOnMount = false,
    abortSeconds = 12
) {
    const [fire, setFire] = useState(fireOnMount);

    useEffect(() => {
        if (fire) {
            let isActive = true;
            let abortController = new AbortController();
            let timeout = setTimeout(() => {
                abortController.abort();
            }, abortSeconds * 1000);
            asyncFunc(abortController.signal).then((res) => {
                import.meta.env.DEV && console.log(res, "resolved", isActive);
                if (isActive && typeof onSuccess === "function") {
                    setFire(false);
                    onSuccess(res);
                }
            }).catch((err) => {
                import.meta.env.DEV && console.log(err, "rejected", isActive);
                if (isActive && typeof onError === "function") {
                    setFire(false);
                    onError(err);
                }
            }).finally(() => {
                if (isActive) {
                    setFire(false);
                }
            });
            return () => {
                import.meta.env.DEV && console.log("unmount");
                isActive = false;
                abortController.abort();
                clearTimeout(timeout);
            }
        }
    }, [fire, asyncFunc, onSuccess, onError, abortSeconds]);

    const fireOnce = useCallback(() => {
        setFire(true);
    }, []);

    return fireOnce;
}

export default useAsync;