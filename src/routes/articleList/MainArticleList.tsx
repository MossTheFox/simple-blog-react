import { Box, Collapse, Pagination, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import AsyncLoadingHandler, { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
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

function MainArticleList({ mode }: {
    mode?: 'all' | 'tag' | 'author' | 'category' | 'search'
}) {

    const [totalArticlesCount, setTotalArticlesCount] = useState(1);
    const perPage = 10;
    const totalPage = useMemo(() => Math.ceil(totalArticlesCount / perPage), [totalArticlesCount]);
    const [page, setPage] = useState(1);

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
    const [loading, setLoading] = useState(false);
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

    // 接管页面变化
    useEffect(() => {
        switch (mode) {
            case 'author':
                setSearchQuery({ author: authorName });
            case 'category':
                setSearchQuery({ category: categoryName });
            case 'tag':
                setSearchQuery({ tag: tagName });
            case 'search':
                setSearchQuery({ searchText: searchText });
            default:
                setSearchQuery(null);
        }
        setPage(1);
        fireFetchPageRerender();
        // TODO: 刷新页码
    }, [mode, authorName, categoryName, tagName, searchText]);


    return <>
        <Typography variant="h5" fontWeight="bolder" gutterBottom
            sx={{
                textIndent: (theme) => theme.spacing(2),
            }}
        >
            {title}
        </Typography>

        <Stack spacing={2} pb={2}>
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
        {(totalPage > 1) && (
            <Box py={2} display='flex' alignItems='center' justifyContent='center'>
                <Pagination color="primary" count={totalPage} page={page} onChange={(_, page) => pageChangeAction(page)} />
            </Box>
        )}
    </>
}

export default MainArticleList;