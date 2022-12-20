import { Box, Fade, Pagination, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import SingleCommentCard from "../../ui/cards/SingleCommentCard";
import NewCommentForBlog from "../../ui/forms/NewCommentForBlog";

function BlogPostComment({
    blogId
}: {
    blogId: number;
}) {
    const [commentPage, setCommentPage] = useState(1);
    const [commentPerPage, setCommentPerPage] = useState(15);
    const [total, setTotal] = useState(0);
    const totalPage = useMemo(() => Math.ceil(total / commentPerPage), [total, commentPerPage]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<null | Error>(null);

    const [comments, setComments] = useState<BlogComment[]>([]);

    const asyncGetCommentData = useCallback(async () => {
        if ((Number.isNaN(blogId))) throw new Error('无效的文章 ID。');
        return await APIService.getCommentsForBlog(blogId, commentPage, commentPerPage);
    }, [blogId, commentPerPage, commentPage]);


    const getCommentOnSuccess = useCallback((data: Awaited<ReturnType<typeof asyncGetCommentData>>) => {
        setLoading(false);
        setErr(null);
        setTotal(data.total);
        setComments(data.data);
    }, []);

    const getCommentOnError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
    }, []);

    const fireFetchComments = useAsync(asyncGetCommentData, getCommentOnSuccess, getCommentOnError);

    const handleFetchComment = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireFetchComments();
    }, [fireFetchComments]);

    useEffect(() => {
        handleFetchComment();
    }, [handleFetchComment]);

    const handlePageChange = useCallback((newPage: number) => {
        setCommentPage(newPage);
        handleFetchComment();
    }, [handleFetchComment]);

    // 回复选择相关
    const [replyTarget, setReplyTarget] = useState<null | { id: number; username: string; }>(null);

    const cancelReplyTo = useCallback(() => setReplyTarget(null), []);

    return <Box>
        <Typography variant='h6' fontWeight='bolder' gutterBottom>
            文章评论 {total ? ` (${total})` : ''}
        </Typography>
        <Box pb={2}>
            <NewCommentForBlog id={blogId} onSubmitCallback={handleFetchComment}
                replyTo={replyTarget || undefined}
                cancelReplyTo={cancelReplyTo}
            />
        </Box>

        {totalPage > 1 &&
            <Box pb={2} display='flex' justifyContent='center'>
                <Pagination color="primary" page={commentPage} count={totalPage}
                    onChange={(e, page) => handlePageChange(page)}
                />
            </Box>
        }

        {loading && <TemplateLoadingPlaceHolder />}
        {!loading && err && <TemplateOnErrorRender
            title={err.message} retryFunc={handleFetchComment} />}

        {!loading && !err && (
            <Fade in>
                <Stack spacing={1}>
                    {comments.length === 0 ? (
                        <Typography variant='body2' color="textSecondary" gutterBottom>
                            还没有评论。
                        </Typography>
                    ) : (
                        comments.map((v, i, arr) => {
                            if (v.replyTo) {
                                let found = arr.find((t) => t.id === v.replyTo);
                                return <SingleCommentCard key={i} comment={v} replyToTarget={found}
                                    actionEndCallback={handleFetchComment}
                                    replyAction={setReplyTarget}
                                />
                            }
                            return <SingleCommentCard key={i} comment={v}
                                actionEndCallback={handleFetchComment}
                                replyAction={setReplyTarget}
                            />
                        })
                    )}
                </Stack>
            </Fade>
        )}
    </Box>

}

export default BlogPostComment;