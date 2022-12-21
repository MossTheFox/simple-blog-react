import { Box, Fade, Pagination, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import AdminSingleCommentCard from "../../ui/cards/AdminSingleCommentCard";

function AdminInspectCommentList({
    selectCallback,
    mode
}: {
    selectCallback: (comment: BlogComment) => void,
    mode: 'verified' | 'toBeVerified'
}) {
    const [workMode, setWorkMode] = useState<typeof mode>(mode);

    const [commentPage, setCommentPage] = useState(1);
    const [commentPerPage, setCommentPerPage] = useState(15);
    const [total, setTotal] = useState(0);
    const totalPage = useMemo(() => Math.ceil(total / commentPerPage), [total, commentPerPage]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<null | Error>(null);

    const [comments, setComments] = useState<BlogComment[]>([]);

    const asyncGetCommentData = useCallback(async () => {
        if (workMode === 'verified') {
            return await APIService.getVerifiedComments(commentPage, commentPerPage);
        }
        return await APIService.getToBeVerifiedComments(commentPage, commentPerPage);
    }, [commentPerPage, commentPage, workMode]);


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
        setWorkMode(mode);
        setCommentPage(1);
        handleFetchComment();
    }, [handleFetchComment, mode]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage === commentPage) return; 
        setCommentPage(newPage);
        handleFetchComment();
    }, [handleFetchComment, commentPage]);

    return <Box>
        <Typography variant="h5" fontWeight='bolder' gutterBottom>
            {mode === 'toBeVerified' ? '待审核的评论' : '已通过的评论'}
        </Typography>

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
                <Box>

                    <Stack spacing={1}>{
                        comments.length === 0 ? (
                            <Typography variant='body2' color="textSecondary" gutterBottom>
                                {mode === 'toBeVerified' ? '没有待审核的评论。' : '还没有评论。'}
                            </Typography>
                        ) : (
                            comments.map((v, i) => {
                                return <AdminSingleCommentCard key={i} comment={v} replyToTarget={v.replyTarget}
                                    replyTargetDeleted={!!(v.replyTo && !v.replyTarget)}
                                    undoPassMode={mode === 'verified'}
                                    actionEndCallback={handleFetchComment} />
                            })
                        )}

                    </Stack>
                    {totalPage > 1 &&
                        <Box py={2} display='flex' justifyContent='center'>
                            <Pagination color="primary" page={commentPage} count={totalPage}
                                onChange={(e, page) => handlePageChange(page)}
                            />
                        </Box>
                    }
                </Box>
            </Fade>
        )}
    </Box>
}

export default AdminInspectCommentList;