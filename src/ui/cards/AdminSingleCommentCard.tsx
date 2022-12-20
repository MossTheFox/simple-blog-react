import { Check, Clear } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, ButtonBase, Card, CardActions, CardContent, CardHeader, IconButton, Link, Menu, MenuItem, Paper, Snackbar, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { PLACEHOLDER_AVATAR_URL } from "../../constants";
import { blogUserContext } from "../../context/userContext";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import DialogLoadingIndicator from "../smallComponents/DialogLoadingIndicator";

function AdminSingleCommentCard({ comment, replyToTarget, replyTargetDeleted, actionEndCallback, undoPassMode = false }: {
    comment: BlogComment;
    replyToTarget?: BlogComment;
    replyTargetDeleted?: boolean;
    actionEndCallback?: () => void;
    undoPassMode?: boolean
}) {

    const { user } = useContext(blogUserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState<{ severity: 'error' | 'success', message: string }>({
        severity: 'success',
        message: '?'
    });

    const asyncHandlePass = useCallback(async () => {
        return await APIService.adminValidateComment(comment.id, undoPassMode);
    }, [comment, undoPassMode]);

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
        setNotificationOpen(true);
    }, []);

    const firePass = useAsync(asyncHandlePass, onSuccess, onError);
    const fireDelete = useAsync(asyncHandleDelete, onSuccess, onError);

    const passHandler = useCallback(() => {
        setLoading(true);
        setError(null);
        firePass();
    }, [firePass]);

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
                <ButtonBase sx={{ borderRadius: '100%' }}
                    onClick={() => navigate('/author/' + comment.user.username)}
                >
                    <Avatar
                        src={comment.user.avatar === PLACEHOLDER_AVATAR_URL ? PLACEHOLDER_AVATAR_URL : APIService.parseResourceUrl(comment.user.avatar)}
                    />
                </ButtonBase>
            }
            title={
                <Typography fontWeight='bolder' children={
                    <Link component={ReactRouterLink}
                        to={'/author/' + comment.user.username}
                        children={
                            comment.user.username
                        }
                        underline='hover'
                    />
                } gutterBottom />
            }
            subheader={comment.user.signature}
            sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom
                children={
                    <Link component={ReactRouterLink}
                        to={`/blog/${comment.blogId}`}
                        children={`文章编号: ${comment.blogId}`}
                        underline='hover' />
                } />
            {replyToTarget && (
                <Paper sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                    <Box p={1} mb={2}>
                        <Typography variant="body2" fontWeight='bold' color="textSecondary" gutterBottom
                            whiteSpace='pre-wrap'
                            children={`回复 ${replyToTarget.user.username}:`} />
                        <Typography variant="body2" color="textSecondary"
                            whiteSpace='pre-wrap'
                            children={`${replyToTarget.content}`} />
                    </Box>
                </Paper>
            )}
            {!replyToTarget && replyTargetDeleted && <Paper sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                <Box p={1} mb={2}>
                    <Typography variant="body2" color="textSecondary"
                        whiteSpace='pre-wrap'
                        children={`回复的评论不存在`} />
                </Box>
            </Paper>
            }

            <Typography variant="body1" whiteSpace='pre-wrap'
                children={comment.content} />
        </CardContent>

        <CardActions sx={{
            justifyContent: 'space-between'
        }}>
            <Button variant="text" startIcon={<Clear />}
                color="error"
                children="删除"
                disabled={loading}
                onClick={(e) => { setAnchorEl(e.currentTarget); setOpen(true); }}
            />
            <Button variant="contained" startIcon={undoPassMode ? undefined : <Check />}
                disabled={loading}
                children={undoPassMode ? '设为待审核' : "通过"}
                color={undoPassMode ? 'secondary' : 'primary'}
                onClick={passHandler}
            />
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

export default AdminSingleCommentCard;