import { Delete, Reply } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, ButtonBase, Card, CardActions, CardContent, CardHeader, Collapse, Link, Menu, MenuItem, Paper, Snackbar, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { PLACEHOLDER_AVATAR_URL } from "../../constants";
import { blogUserContext } from "../../context/userContext";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import ReplyCommentSubComponent from "../forms/ReplyCommentSubComponent";
import DialogLoadingIndicator from "../smallComponents/DialogLoadingIndicator";

function SingleCommentCard({ comment, replyToTarget, replyTargetDeleted, actionEndCallback, replyAction }: {
    comment: BlogComment;
    replyToTarget?: BlogComment;
    actionEndCallback?: () => void;
    replyTargetDeleted?: boolean;
    replyAction?: (data: { id: number; username: string; }) => void
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

    // 回复相关
    const [openReplyField, setOpenReplyField] = useState(false);
    const onSubmitCallback = useCallback(() => {
        setOpenReplyField(false);
        const message = (() => {
            if (user === 'Not Login') return '?';
            if (user.flags.includes('ADMIN')) {
                return '发布成功，请记得前往审核页面通过自己的评论。';
            }
            return '发布成功，评论将在审核完成后显示。'
        })();
        setNotification({
            severity: 'success',
            message
        });
        setNotificationOpen(true);
    }, [user]);

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
        <CardContent sx={{ py: 1 }}>
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
                children={comment.content} gutterBottom />
            
            <Typography textAlign='end' color="textSecondary" variant="body2"
                children={'发布于: ' + comment.time.toLocaleString()}
            />

            {/* 回复评论输入框部分 */}
            <Collapse in={openReplyField} unmountOnExit={false}>
                <ReplyCommentSubComponent blogId={comment.blogId} replyId={comment.id}
                    onSubmitCallback={onSubmitCallback}
                />
            </Collapse>

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
            <Button variant="text" startIcon={<Reply />} children="回复"
                onClick={() => setOpenReplyField((prev) => !prev)}
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

export default SingleCommentCard;