import { Box, Pagination, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncLoadingHandler, { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import BlogSummaryCardMain from "../../ui/cards/BlogSummaryCardMain";
import { blogSummaryTestData } from "../../_testData";

function MainArticleList({ query }: {
    query?: {
        author?: string;
        tag?: string;
        category?: string;
    }
}) {

    const [totalArticlesCount, setTotalArticlesCount] = useState(1);
    const perPage = 10;
    const totalPage = useMemo(() => Math.ceil(totalArticlesCount / perPage), [totalArticlesCount]);
    const [page, setPage] = useState(1);

    const title = useMemo(() => {
        if (!query) return '所有文章';
        if (query.author) return `作者: ${query.author}`;
        if (query.tag) return `标签: ${query.tag}`;
        if (query.category) return `分类: ${query.category}`;

        return '所有文章';
    }, [query]);

    // 获取文章总数 (与获取文章列表不冲突，同步进行。默认拉取首页) (不刷新)
    const asyncFetchPageCount = useCallback(() => {
        return new Promise<number>((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve(55) : reject(new Error('模拟错误'))
            }, 1000);
        });
    }, [query]);

    const [articleList, setArticleList] = useState<BlogSummaryData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // 拉取文章列表 (会在生命周期内刷新)
    const asyncFetchArticleList = useCallback(() => {
        // fake loading
        return new Promise<BlogSummaryData[]>((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve(new Array<BlogSummaryData>(10).fill(blogSummaryTestData)
                    .map((v, i) => {
                        return {
                            ...v,
                            title: v.title + ` ${page}, ${i}`
                        }
                    })) : reject(new Error('模拟错误'))
            }, 1000);
        });
    }, [page, query]);

    const fetchArticleListOnSuccess = useCallback((data: BlogSummaryData[]) => {
        setArticleList(data);
        setLoading(false);
        setError(null);
    }, []);

    const fetchArticleListOnError = useCallback((err: Error) => {
        setLoading(false);
        setError(err);
    }, []);

    const fireHook = useAsync(asyncFetchArticleList, fetchArticleListOnSuccess, fetchArticleListOnError);

    const fireFetchPageRerender = useCallback(() => {
        setLoading(true);
        setError(null);
        fireHook();
    }, [fireHook]);

    // 初次渲染
    useEffect(() => {
        fireFetchPageRerender();
    }, [fireFetchPageRerender]);

    const pageChangeAction = useCallback((v: number) => {
        setPage(v);
        fireFetchPageRerender();
    }, [fireFetchPageRerender]);


    return <>
        <Typography variant="h5" fontWeight="bolder" gutterBottom
            sx={{
                textIndent: (theme) => theme.spacing(2),
            }}
        >
            {title}
        </Typography>

        <Stack spacing={2}>
            {/* 生命周期内会发生变化的组件，不使用 AsyncLoadingHandler */}
            {loading ? (<TemplateLoadingPlaceHolder />) : (
                error ? (
                    <TemplateOnErrorRender message={error.message} retryFunc={fireFetchPageRerender} />
                ) : (
                    articleList.map((v, i) =>
                        <BlogSummaryCardMain key={i} blogSummaryData={v} />
                    )
                )
            )}
        </Stack>

        <AsyncLoadingHandler asyncFunc={asyncFetchPageCount}
            OnSuccessRender={({ data }: { data: number }) => {
                useEffect(() => {
                    setTotalArticlesCount(data);
                }, [data]);
                return <>
                    {totalPage > 1 && (
                        <Box py={2} display='flex' alignItems='center' justifyContent='center'>
                            <Pagination color="primary" count={totalPage} page={page} onChange={(_, page) => pageChangeAction(page)} />
                        </Box>
                    )}
                </>
            }}
        />
    </>
}

export default MainArticleList;