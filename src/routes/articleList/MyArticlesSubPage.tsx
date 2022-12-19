import { Box, Collapse, Fade, Link, Pagination, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import BlogSummaryCardMain from "../../ui/cards/BlogSummaryCardMain";

type SearchQuery = {
    author: string;
    tag: string;
    category: string;
    searchText: string;
};

function MyArticlesSubPage({ username }: {
    username: string
}) {

    const [totalArticlesCount, setTotalArticlesCount] = useState(1);
    const perPage = 10;
    const totalPage = useMemo(() => Math.ceil(totalArticlesCount / perPage), [totalArticlesCount]);
    const [page, setPage] = useState(1);

    const searchQuery = useMemo<Partial<SearchQuery>>(() => ({ author: username }), [username]);

    const title = useMemo(() => {
        return `${username} 发布的文章`
    }, [username]);

    const [articleList, setArticleList] = useState<BlogSummaryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // 拉取文章总数与列表 (会在组件生命周期内刷新)
    const asyncFetchArticleList = useCallback(async () => {
        return await APIService.getBlogSummaryList({
            ...searchQuery,
            perPage: perPage,
            thisPage: page
        });
    }, [page, searchQuery, perPage]);

    const fetchArticleListOnSuccess = useCallback(({ data, total }: { data: BlogSummaryData[], total: number }) => {
        setArticleList(data);
        setTotalArticlesCount(total);
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
        if (v === page) return;
        setPage(v);
        fireFetchPageRerender();
    }, [fireFetchPageRerender, page]);

    return <>
        <Typography variant="h5" fontWeight="bolder" gutterBottom
            sx={{
                textIndent: (theme) => theme.spacing(2),
            }}
        >
            {title}
        </Typography>

        <Box pb={2}>
            {/* 生命周期内会发生变化的组件，不使用 AsyncLoadingHandler */}
            {loading ? (<TemplateLoadingPlaceHolder />) : (
                error ? (
                    <TemplateOnErrorRender message={error.message} retryFunc={fireFetchPageRerender} />
                ) : (
                    <Fade in>
                        <Stack spacing={2}>
                            {
                                articleList.map((v, i) =>
                                    <BlogSummaryCardMain key={i} blogSummaryData={v} />
                                )
                            }

                            {articleList.length === 0 && (
                                <Typography variant="body2" color="textSecondary" gutterBottom
                                    sx={{
                                        textIndent: (theme) => theme.spacing(2),
                                    }}
                                >
                                    暂时还没有文章。
                                </Typography>
                            )}
                        </Stack>
                    </Fade>

                )
            )}
        </Box>
        {(totalPage > 1) && (
            <Box py={2} display='flex' alignItems='center' justifyContent='center'>
                <Pagination color="primary" count={totalPage} page={page} onChange={(_, page) => pageChangeAction(page)} />
            </Box>
        )}
    </>
}

export default MyArticlesSubPage;