import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogUserContext } from "../../context/userContext";
import DialogLoadingIndicator from "../../ui/smallComponents/DialogLoadingIndicator";
import BlogPostEditor, { initBlogEditorData } from "./BlogPostEditor";

function BlogPostEditorPage({ mode }: { mode: 'new' | 'edit' }) {

    const [open, setOpen] = useState(false);
    const [submitTarget, setSubmitTarget] = useState<BlogPostEditorData>(initBlogEditorData);

    const [loading, setLoading] = useState(false);

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


    const { user, set } = useContext(blogUserContext);
    const navigate = useNavigate();

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
                {JSON.stringify(submitTarget)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleClose}>确认</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default BlogPostEditorPage;