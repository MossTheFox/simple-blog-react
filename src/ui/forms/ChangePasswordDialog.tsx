import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogUserContext } from "../../context/userContext";
import { TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import DialogLoadingIndicator from "../smallComponents/DialogLoadingIndicator";

function ChangePasswordDialog({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (bool: boolean) => void
}) {

    const { user, init } = useContext(blogUserContext);
    const navigate = useNavigate();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<null | Error>(null);

    const handleClose = useCallback(() => {
        if (!loading) setOpen(false);
    }, [setOpen, loading])

    const asyncSubmit = useCallback(async () => {
        if (!input) throw new Error('无效的新密码');
        return await APIService.changePassword(input);
    }, [input]);

    const onSuccess = useCallback(() => {
        setOpen(false);
        setInput('');
        setErr(null);
        setLoading(false);
        init();
        navigate('/', { replace: true });
    }, [setOpen, init, navigate]);

    const onError = useCallback((err: Error) => {
        setLoading(false);
        setErr(err);
    }, []);

    const fireOnce = useAsync(asyncSubmit, onSuccess, onError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireOnce();
    }, [fireOnce]);


    return <Dialog fullWidth open={open} onClose={handleClose} maxWidth='sm'>
        <DialogLoadingIndicator loading={loading} />
        <DialogTitle fontWeight='bolder'>修改登陆密码</DialogTitle>
        <DialogContent>
            <DialogContentText gutterBottom>密码修改后，将会须要重新登录一下。</DialogContentText>
            <TextField type="password" label="新的密码" autoComplete="new-password" fullWidth 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
            />

            {err &&
                <Box mt={2}>
                    <TemplateOnErrorRender message={err.message} retryFunc={handleSubmit} />
                </Box>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} disabled={loading}>取消</Button>
            <Button onClick={handleSubmit} disabled={loading || input.length <= 0}>确定更新</Button>
        </DialogActions>
    </Dialog>
}

export default ChangePasswordDialog;