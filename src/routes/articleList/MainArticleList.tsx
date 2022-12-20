import { Box, Collapse, Fade, Link, Pagination, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link as ReactRouterLink, useSearchParams } from 'react-router-dom';
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import BlogSummaryCardMain from "../../ui/cards/BlogSummaryCardMain";
import { blogSummaryTestData } from "../../_testData";

type SearchQuery = {
    author: string;
    tag: string;
    category: string;
    searchText: string;
};

function MainArticleList({ mode = 'all' }: {
    mode?: 'all' | 'tag' | 'author' | 'category' | 'search'
}) {

    const [totalArticlesCount, setTotalArticlesCount] = useState(1);
    const perPage = 10;
    const totalPage = useMemo(() => Math.ceil(totalArticlesCount / perPage), [totalArticlesCount]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState<number>(+(searchParams.get('page') || 1));

    // Fix 
    useEffect(() => {
        if (page > totalPage) {
            setPage(totalPage);
        }
    }, [page, totalPage]);

    const { authorName, categoryName, tagName, searchText } = useParams();

    const [searchQuery, setSearchQuery] = useState<null | Partial<SearchQuery>>(null);

    const title = useMemo(() => {
        switch (mode) {
            case 'author':
                return `作者: ${authorName}`;
            case 'category':
                return `分类: ${categoryName}`;
            case 'tag':
                return `标签: ${tagName}`;
            case 'search':
                return `搜索: ${searchText}`;
            default:
                return '所有文章';
        }
    }, [mode, authorName, categoryName, tagName, searchText]);

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
        let page = +(searchParams.get('page') || 1);
        setPage(page);
        fireFetchPageRerender();
    }, [searchParams, fireFetchPageRerender]);

    const pageChangeAction = useCallback((v: number) => {
        if (v === page) return;
        setPage(v);
        fireFetchPageRerender();
        setSearchParams({ page: v + '' })
    }, [fireFetchPageRerender, page]);

    // 接管页面变化
    useEffect(() => {
        switch (mode) {
            case 'author':
                setSearchQuery({ author: authorName });
                break;
            case 'category':
                setSearchQuery({ category: categoryName });
                break;
            case 'tag':
                setSearchQuery({ tag: tagName });
                break;
            case 'search':
                setSearchQuery({ searchText: searchText });
                break;
            default:
                setSearchQuery(null);
        }
        let page = +(searchParams.get('page') || 1);
        setPage(page);
        fireFetchPageRerender();
    }, [mode, authorName, categoryName, tagName, searchText]);


    return <>
        <Typography variant="h5" fontWeight="bolder" gutterBottom
            sx={{
                textIndent: (theme) => theme.spacing(2),
            }}
        >
            {title}
        </Typography>
        {mode !== 'all' &&
            <Typography variant="body2" gutterBottom
                sx={{
                    textIndent: (theme) => theme.spacing(2),
                }}
            >
                <Link component={ReactRouterLink} underline="hover"
                    to="/"
                >返回所有文章列表</Link>
            </Typography>
        }
        {(totalPage > 1) && (
            <Box pb={2} display='flex' alignItems='center' justifyContent='center'>
                <Pagination color="primary" count={totalPage} page={page} onChange={(_, page) => pageChangeAction(page)} />
            </Box>
        )}
        <Box pb={2}>
            {/* 生命周期内会发生变化的组件，不使用 AsyncLoadingHandler */}
            {loading ? (<TemplateLoadingPlaceHolder />) : (
                error ? (
                    <TemplateOnErrorRender message={error.message} retryFunc={fireFetchPageRerender} />
                ) : (
                    <Fade in>
                        <Box>

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
                            {(totalPage > 1) && (
                                <Box py={2} display='flex' alignItems='center' justifyContent='center'>
                                    <Pagination color="primary" count={totalPage} page={page} onChange={(_, page) => pageChangeAction(page)} />
                                </Box>
                            )}
                        </Box>
                    </Fade>

                )
            )}
        </Box>
    </>
}

export default MainArticleList;