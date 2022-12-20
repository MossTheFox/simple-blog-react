import { Alert, Box, Button, Link, Paper, Snackbar, TextField, Typography } from "@mui/material"
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { blogUserContext } from "../../context/userContext";
import { TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function NewCommentForBlog({ id, onSubmitCallback, replyTo, cancelReplyTo }: {
    id: number,
    replyTo?: { id: number; username: string; }
    cancelReplyTo?: () => void
    onSubmitCallback: () => void
}) {

    const { user } = useContext(blogUserContext);

    const [replyTarget, setReplyTarget] = useState(-1);

    const [input, setInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    /** 危: replyTo 变化 */
    const asyncHandleSubmit = useCallback(async () => {
        return await APIService.postComment(input, id, replyTarget > 0 ? replyTarget : undefined);
    }, [replyTarget, input, id]);

    useEffect(() => {
        setErr(null);
        setLoading(false);
        if (replyTo) {
            setReplyTarget(replyTo.id);
        }
    }, [replyTo]);

    const onSuccess = useCallback(() => {
        setLoading(false);
        setErr(null);
        setInput('');
        if (onSubmitCallback) {
            onSubmitCallback();
        }
        setNotificationOpen(true);
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

    // extra
    const [notificationOpen, setNotificationOpen] = useState(false);
    const msg = useMemo(() => {
        if (user === 'Not Login') return '?';
        if (user.flags.includes('ADMIN')) {
            return '发布成功，请记得前往审核页面通过自己的评论。';
        }
        return '发布成功，评论将在审核完成后显示。'
    }, [user]);

    return <Paper>
        <Box px={2} py={1}>
            <Typography variant="body1" color="primary" fontWeight='bolder' gutterBottom>
                {typeof user === 'object' ? '撰写评论' : '登录后可以发表评论'}
            </Typography>
            <Box mb={2}>
                {replyTarget > 0 && (<>
                    <Typography variant="body2" color='textSecondary'>
                        {replyTo ? `回复: ${replyTo.username}` : ''}
                    </Typography>
                    <Link component='button' variant="body2" underline='hover' children="取消"
                        onClick={() => { setReplyTarget(-1); cancelReplyTo && cancelReplyTo() }}
                        disabled={loading}
                    />
                </>
                )}
                <TextField multiline rows={3} fullWidth
                    size="small"
                    aria-label="评论输入框"
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
                <Button variant="text" children='发表评论' disabled={!input.length}
                    onClick={handleSubmit}
                />
            </Box>
            <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}>
                <Alert severity="success" variant="filled">{msg}</Alert>
            </Snackbar>
        </Box>
    </Paper>
}

export default NewCommentForBlog;