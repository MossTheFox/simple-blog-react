import { Alert, Button, ButtonProps, Menu, MenuItem, Snackbar } from "@mui/material";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { blogUserContext } from "../../context/userContext";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function UserSignOffButton(props: ButtonProps) {

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { user, set } = useContext(blogUserContext);

    const [loading, setLoading] = useState(false);
    const [err, setError] = useState<Error | null>(null);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const msg = useMemo(() => {
        if (loading) return '';
        if (err) return '登出时发生错误: ' + err.message;
        return '已登出';
    }, [err, loading]);

    const asyncFireSignOff = useCallback(async () => {
        return await APIService.signoff();
    }, []);

    const onSuccess = useCallback(() => {
        setOpen(false);
        setLoading(false);
        setError(null);
        set('Not Login');
    }, [set]);

    const onError = useCallback((e: Error) => {
        setOpen(false);
        setLoading(false);
        setError(e);
        setNotificationOpen(true);
    }, []);

    const fireOnce = useAsync(asyncFireSignOff, onSuccess, onError);

    const doSignOff = useCallback(() => {
        setLoading(true);
        setError(null);
        fireOnce();
    }, []);

    return <>
        <Button children="登出" {...props} onClick={(e) => { setAnchorEl(e.currentTarget); setOpen(true); }} />

        <Menu open={open} anchorEl={anchorEl} onClose={(e) => setOpen(false)} >
            <MenuItem disabled={loading} sx={{ color: (theme) => theme.palette.error.main }} onClick={doSignOff}>确认登出</MenuItem>
            <MenuItem onClick={() => setOpen(false)}>取消</MenuItem>
        </Menu>

        <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}>
            <Alert severity="error" variant="filled">{msg}</Alert>
        </Snackbar>

    </>
}

export default UserSignOffButton;