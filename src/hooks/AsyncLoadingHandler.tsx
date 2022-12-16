import { Box, CircularProgress, Fade } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ErrorBox from "../ui/smallComponents/ErrorBox";
import useAsync from "./useAsync";

export function TemplateLoadingPlaceHolder() {
    return <Box display="block" textAlign="center">
        <Fade in style={{
            transitionDelay: '800ms'
        }}>
            <CircularProgress aria-label="请稍等一下..." color="primary" />
        </Fade>
    </Box>;
}

export function TemplateOnErrorRender({ title, message = '未知错误', retryFunc }: {
    title?: string
    message?: string,
    retryFunc?: () => void
}) {
    return <ErrorBox message={message} title={title || '出错了'} retryFunc={retryFunc} />
}

/**
 * 需要异步加载、稍后显示的内容，借助这个套起来。
 * 
 * 适用于**不会需要在生命周期内发生刷新的组件**。(```asyncFunc``` 的变化不会触发 rerender.)
 * 
 * 必须的字段: ```asyncFunc``` 与 ```OnSuccessRender```。
 * 
 * 留意: render 相关的参数接受的是一个返回 JSX.Element 的**函数**。
 */
function AsyncLoadingHandler<T>({
    asyncFunc,
    LoadingPlaceholder = TemplateLoadingPlaceHolder,
    OnSuccessRender,
    OnErrorRender = TemplateOnErrorRender,
}: {
    asyncFunc: (signal?: (AbortSignal)) => Promise<T>;
    LoadingPlaceholder?: () => JSX.Element;
    OnSuccessRender: ({ data }: {
        data: T;
    }) => JSX.Element;
    OnErrorRender?: ({ message, retryFunc }: {
        message?: string,
        retryFunc?: () => void
    }) => JSX.Element;
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);

    const asyncOnSuccess = useCallback((data: T) => {
        setData(data);
        setError(null);
        setLoading(false);
    }, []);

    const asyncOnError = useCallback((err: Error) => {
        setLoading(false);
        setError(err);
        setData(null);
    }, []);


    const fireOnce = useAsync(asyncFunc, asyncOnSuccess, asyncOnError);

    const startFetch = useCallback(() => {
        setLoading(true);
        setError(null);
        setData(null);
        fireOnce();
    }, [fireOnce]);

    useEffect(() => {
        fireOnce();
    }, [fireOnce]);

    return (
        loading ? (
            <LoadingPlaceholder />
        ) : (
            error ? (
                <OnErrorRender message={error?.message || '未知错误'} retryFunc={startFetch} />
            ) : (
                <OnSuccessRender data={data!} />
            )
        )
    )
}

export default AsyncLoadingHandler;