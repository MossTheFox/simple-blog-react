import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import AdminSingleCommentCard from "../../ui/cards/AdminSingleCommentCard";

function PassedCommentList({
    selectCallback
}: {
    selectCallback: (comment: BlogComment) => void
}) {
    const [commentPage, setCommentPage] = useState(1);
    const [commentPerPage, setCommentPerPage] = useState(50);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<null | Error>(null);

    const [comments, setComments] = useState<BlogComment[]>([]);

    const asyncGetCommentData = useCallback(async () => {
        return await APIService.getVerifiedComments(commentPage, commentPerPage);
    }, [commentPerPage, commentPage]);


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

    return <Box>
        <Typography variant="h5" fontWeight='bolder' gutterBottom>
            已通过的评论
        </Typography>

        <Stack spacing={1}>
            {loading && <TemplateLoadingPlaceHolder />}
            {!loading && err && <TemplateOnErrorRender
                title={err.message} retryFunc={handleFetchComment} />}
            {!loading && !err && (
                comments.length === 0 ? (
                    <Typography variant='body2' color="textSecondary" gutterBottom>
                        还没有评论。
                    </Typography>
                ) : (
                    comments.map((v, i, arr) => {
                        if (v.replyTo) {
                            let found = arr.find((t) => t.id === v.replyTo);
                            return <AdminSingleCommentCard key={i} comment={v} replyToTarget={found}
                                actionEndCallback={handleFetchComment}
                                undoPassMode
                            />
                        }
                        return <AdminSingleCommentCard key={i} comment={v} actionEndCallback={handleFetchComment}
                            undoPassMode
                        />
                    })
                )
            )}
        </Stack>
    </Box>
}

export default PassedCommentList;