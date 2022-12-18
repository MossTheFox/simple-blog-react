import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import { blogUserContext } from "../../context/userContext";
import { TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function UserRegisterDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (b: boolean) => void
}) {

    const { init } = useContext(blogUserContext);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    const [input, setInput] = useState({
        username: '',
        password: '',
        code: ''
    });

    useEffect(() => {
        if (open) {
            setInput({
                username: '',
                password: '',
                code: ''
            });
        }
    }, [open]);

    const handleClose = useCallback(() => {
        if (loading) return;
        setOpen(false);
    }, [setOpen, loading]);

    const asyncHandleSubmit = useCallback(async () => {
        return await APIService.register(input.username, input.password, input.code);
    }, [input]);

    const onSuccess = useCallback(() => {
        setLoading(false);
        setErr(null);
        setOpen(false);
        init();
    }, [init, handleClose]);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
    }, []);

    const fireOnce = useAsync(asyncHandleSubmit, onSuccess, onError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireOnce();
    }, [fireOnce]);

    return <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle fontWeight='bolder'>用户注册</DialogTitle>
        <DialogContent>
            <DialogContentText gutterBottom>
                请留意：此博客系统仅用作功能示范，不提供公共内容发布功能。
            </DialogContentText>
            <Stack spacing={2} py={1}>
                <TextField label="用户名" autoComplete="username"
                    value={input.username}
                    onChange={(e) => setInput((prev) => ({ ...prev, username: e.target.value.substring(0, 20) }))}
                />
                <TextField label="密码"
                    type='password'
                    autoComplete="new-password"
                    value={input.password}
                    onChange={(e) => setInput((prev) => ({ ...prev, password: e.target.value }))}
                />
                <TextField label="邀请码" autoComplete="off"
                    size="small"
                    variant="standard"
                    value={input.code}
                    onChange={(e) => setInput((prev) => ({ ...prev, code: e.target.value }))}
                />
            </Stack>
            {err &&
                <TemplateOnErrorRender message={err.message}

                />
            }
        </DialogContent>
        <DialogActions>
            <Button
                disabled={loading}
                onClick={handleClose}
            >取消</Button>
            <Button variant="contained"
                disabled={loading || (
                    !input.code || !input.password || !input.username
                )}
                onClick={handleSubmit}
            >立即注册</Button>
        </DialogActions>
    </Dialog>
}

export default UserRegisterDialog;