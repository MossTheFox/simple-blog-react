import { Alert, Box, Button, Link, Paper, Snackbar, TextField, Typography } from "@mui/material"
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { blogUserContext } from "../../context/userContext";
import { TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function ReplyCommentSubComponent({ blogId, onSubmitCallback, replyId, cancelReplyTo }: {
    blogId: number,
    replyId: number,
    cancelReplyTo?: () => void
    onSubmitCallback: () => void
}) {

    const { user } = useContext(blogUserContext);

    const [replyTarget, setReplyTarget] = useState(replyId);

    const [input, setInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    const asyncHandleSubmit = useCallback(async () => {
        return await APIService.postComment(input, blogId, replyTarget > 0 ? replyTarget : undefined);
    }, [replyTarget, input, blogId]);

    const onSuccess = useCallback(() => {
        setLoading(false);
        setErr(null);
        setInput('');
        if (onSubmitCallback) {
            onSubmitCallback();
        }
    }, [onSubmitCallback])

    const onError = useCallback((e: Error) => {
        setErr(e);
        setLoading(false);
    }, []);

    const fireOnce = useAsync(asyncHandleSubmit, onSuccess, onError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireOnce();
    }, []);

    return <Box pt={1}>
        <Typography variant="body1" fontWeight='bolder' gutterBottom>
            {typeof user === 'object' ? '回复' : '登录后可以发表回复'}
        </Typography>
        <Box mb={2}>
            <TextField multiline rows={3} fullWidth
                size="small"
                aria-label="回复输入框"
                disabled={typeof user !== 'object' || loading}
                onChange={(e) => setInput(e.target.value.substring(0, 100))}
                value={input}
            />
        </Box>
        {err &&
            <TemplateOnErrorRender message={err.message}
                retryFunc={handleSubmit}
            />}

        <Box display="flex" justifyContent='space-between'>
            <Typography variant="body2" color='textSecondary' gutterBottom>
                {input.length}/100
            </Typography>
            <Button variant="text" children='发表回复' disabled={!input.length || loading}
                onClick={handleSubmit}
            />
        </Box>
    </Box>;
}

export default ReplyCommentSubComponent;