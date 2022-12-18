import { Send, SettingsPowerRounded } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogUserContext } from "../../context/userContext";
import { TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import BlogPostEditor, { initBlogEditorData } from "./BlogPostEditor";

function BlogPostEditorPage({ mode }: { mode: 'new' | 'edit' }) {

    const navigate = useNavigate();

    const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [submitTarget, setSubmitTarget] = useState<BlogPostEditorData>(initBlogEditorData);

    const [loading, setLoading] = useState(false);
    const [err, setError] = useState<Error | null>(null);

    const [menuDialogOpen, setMenuDialogOpen] = useState(false);
    /** 编辑模式下使用 */
    const { id } = useParams();

    const submitCallback = useCallback((data: BlogPostEditorData) => {
        setSubmitTarget(data);
        setSubmitDialogOpen(true);
    }, []);

    const actionMenuCallback = useCallback(() => {
        setMenuDialogOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        if (loading) return;
        setSubmitDialogOpen(false);
        setMenuDialogOpen(false);
    }, [loading]);

    /** 发布 */
    const asyncSubmit = useCallback(async () => {
        if (mode === 'edit') {
            if (typeof id === 'undefined') throw new Error('无效的文章 ID');
            return await APIService.updateArticle({ ...submitTarget, id: +id });
        }
        return await APIService.postArticle(submitTarget);
    }, [submitTarget, mode, id])

    const submitOnSuccess = useCallback((newID: number) => {
        setLoading(false);
        setError(null);
        navigate(`/blog/${newID}`, {
            replace: true
        });
    }, [navigate]);

    const submitOnError = useCallback((e: Error) => {
        setLoading(false);
        setError(e);
    }, []);

    const fireOnce = useAsync(asyncSubmit, submitOnSuccess, submitOnError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setError(null);
        fireOnce();
    }, [fireOnce]);

    /** 删除 (仅 Edit Mode) */

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteErr, setDeleteError] = useState<Error | null>(null);

    const asyncDelete = useCallback(async () => {
        if (typeof id === 'undefined') throw new Error('无效的文章 ID');
        return await APIService.deleteArticle(+id);
    }, [id])

    const deleteOnSuccess = useCallback(() => {
        setDeleteLoading(false);
        setDeleteError(null);
        navigate('/');
    }, [navigate]);

    const deleteOnError = useCallback((e: Error) => {
        setDeleteLoading(false);
        setDeleteError(e);
    }, []);

    const fireDelete = useAsync(asyncDelete, deleteOnSuccess, deleteOnError);

    const handleDelete = useCallback(() => {
        setDeleteLoading(true);
        setDeleteError(null);
        fireDelete();
    }, [fireDelete])

    const { user, set } = useContext(blogUserContext);

    useEffect(() => {
        if (typeof user === 'string' ||
            (mode === 'edit' && (typeof id === 'undefined' || Number.isNaN(+id)))
        ) {
            navigate('/', {
                replace: true
            })
        }
    }, [navigate, user, mode, id])


    return <>
        <BlogPostEditor mode={mode} submitCallback={submitCallback} actionMenuCallback={actionMenuCallback} />

        <Dialog open={submitDialogOpen} fullWidth maxWidth='md' onClose={handleClose}>
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle>{mode === 'edit' ? '修改' : '发布'}确认</DialogTitle>
            <DialogContent>
                {/* TODO: 改样式 */}
                <Typography variant="body2" whiteSpace='pre-wrap'>
                    {JSON.stringify(submitTarget, null, 2)}
                </Typography>
                {err && <TemplateOnErrorRender
                    message={`发布时发生错误: ${err.message}`}
                    retryFunc={handleSubmit}
                />
                }
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} onClick={handleClose}>取消</Button>
                <Button variant="contained" startIcon={<Send />}
                    disabled={loading}
                    onClick={handleSubmit}>确认</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={menuDialogOpen} fullWidth maxWidth='sm' onClose={handleClose}>
            <DialogLoadingIndicator loading={deleteLoading} />
            <DialogTitle>更多操作</DialogTitle>
            <DialogContent>
                <Stack spacing={1} pb={2}>
                    <Box>
                        <Button variant="contained" color="error"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >删除文章</Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                        此操作不可撤销。
                    </Typography>
                </Stack>
                {deleteErr && <TemplateOnErrorRender
                    message={`删除时发生错误: ${deleteErr.message}`}
                    retryFunc={handleDelete}
                />
                }
            </DialogContent>
            <DialogActions>
                <Button disabled={deleteLoading} onClick={handleClose}>取消</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default BlogPostEditorPage;