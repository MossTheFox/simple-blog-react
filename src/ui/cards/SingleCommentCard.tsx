import { Delete, Reply } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { PLACEHOLDER_AVATAR_URL } from "../../constants";
import { blogUserContext } from "../../context/userContext";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import DialogLoadingIndicator from "../smallComponents/DialogLoadingIndicator";

function SingleCommentCard({ comment, replyToTarget, actionEndCallback }: {
    comment: BlogComment;
    replyToTarget?: BlogComment;
    actionEndCallback?: () => void
}) {

    const { user } = useContext(blogUserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState<{ severity: 'error' | 'success', message: string }>({
        severity: 'success',
        message: '?'
    });

    const asyncHandleDelete = useCallback(async () => {
        return await APIService.deleteComment(comment.id);
    }, [comment]);

    const onSuccess = useCallback(() => {
        setLoading(false);
        setError(null);
        if (actionEndCallback) {
            actionEndCallback();
        }
        setNotification({
            severity: 'success',
            message: '操作成功'
        });
    }, [actionEndCallback]);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setError(e);
        setNotification({
            severity: 'error',
            message: '发生错误: ' + e.message
        });
    }, []);

    const fireDelete = useAsync(asyncHandleDelete, onSuccess, onError);

    const deleteHandler = useCallback(() => {
        setLoading(true);
        setError(null);
        fireDelete();
    }, [fireDelete]);

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return <Card>
        <DialogLoadingIndicator loading={loading} />
        <CardHeader
            avatar={
                <Avatar
                    src={comment.user.avatar === PLACEHOLDER_AVATAR_URL ? PLACEHOLDER_AVATAR_URL : APIService.parseResourceUrl(comment.user.avatar)}
                />
            }
            title={
                <Typography fontWeight='bolder' children={comment.user.username} gutterBottom />
            }
            subheader={comment.user.signature}
            sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 1 }}>
            {replyToTarget && (
                <Typography variant="body2" color="textSecondary" gutterBottom
                    children={`回复: ${replyToTarget.user.username}`} />
            )}
            <Typography variant="body1" whiteSpace='pre-wrap'
                children={comment.content} />
        </CardContent>

        <CardActions sx={{
            justifyContent: 'space-between'
        }}>
            <Box>
                {typeof user === 'object' && (
                    user.username === comment.user.username || user.flags.includes('ADMIN')
                ) && (
                        <Button variant="text" startIcon={<Delete />}
                            color="error"
                            size="small"
                            children="删除"
                            disabled={loading}
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setOpen(true);
                            }}
                        />
                    )}
            </Box>
            <Button disabled variant="text" startIcon={<Reply />} children="回复" />
        </CardActions>

        <Menu open={open} anchorEl={anchorEl} onClose={(e) => setOpen(false)} >
            <MenuItem disabled={loading} sx={{ color: (theme) => theme.palette.error.main }} onClick={deleteHandler}>确认删除</MenuItem>
            <MenuItem onClick={() => setOpen(false)}>取消</MenuItem>
        </Menu>

        <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}>
            <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
        </Snackbar>

    </Card>
}

export default SingleCommentCard;