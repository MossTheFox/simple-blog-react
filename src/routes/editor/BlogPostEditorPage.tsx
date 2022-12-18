import { Send, SettingsPowerRounded } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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

    const [open, setOpen] = useState(false);
    const [submitTarget, setSubmitTarget] = useState<BlogPostEditorData>(initBlogEditorData);

    const [loading, setLoading] = useState(false);
    const [err, setError] = useState<Error | null>(null);

    /** 编辑模式下使用 */
    const { id } = useParams();

    const submitCallback = useCallback((data: BlogPostEditorData) => {
        setSubmitTarget(data);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        if (loading) return;
        setOpen(false);
    }, [loading]);

    /** 发布 */
    const asyncSubmit = useCallback(async () => {
        if (typeof id === 'undefined') throw new Error('无效的文章 ID');
        if (mode === 'edit') {
            return await APIService.updateArticle({...submitTarget, id: +id});
        }
        return await APIService.postArticle(submitTarget);
    }, [submitTarget, mode, id])

    const submitOnSuccess = useCallback((newID: number) => {
        setLoading(false);
        setError(null);
        navigate(`/blog/${newID}`);
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
        <BlogPostEditor mode={mode} submitCallback={submitCallback} />

        <Dialog open={open} fullWidth maxWidth='md' onClose={handleClose}>
            <DialogLoadingIndicator loading={loading} />
            <DialogTitle>{mode === 'edit' ? '修改' : '发布'}确认</DialogTitle>
            <DialogContent>
                {JSON.stringify(submitTarget, null, 2)}
                {err && <TemplateOnErrorRender
                    message={`发布时发生错误: ${err.message}`}
                    retryFunc={handleSubmit}
                />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button variant="contained" startIcon={<Send />}
                    disabled={loading}
                    onClick={handleSubmit}>确认</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default BlogPostEditorPage;