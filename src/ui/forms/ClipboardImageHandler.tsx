import { InsertPhoto } from "@mui/icons-material";
import { Alert, Box, Button, ButtonProps, LinearProgress, Snackbar } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import DialogLoadingIndicator from "../smallComponents/DialogLoadingIndicator";

function ClipboardImageHandler({ urlCallback, file, setFile }: {
    urlCallback: (url: string) => void,
    file: File | null,
    setFile: (f: File | null) => void
}) {

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const asyncUploadFile = useCallback(async () => {
        if (!file) throw new Error('没有选择文件');
        return await APIService.uploadImageFile(file);
    }, [file]);

    const onSuccess = useCallback((url: string) => {
        urlCallback(APIService.parseResourceUrl(url));
        setLoading(false);
        setErr(null);
        setFile(null);
    }, [urlCallback]);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
        setNotificationOpen(true);
    }, []);

    const fireOnce = useAsync(asyncUploadFile, onSuccess, onError);

    const handleUpload = useCallback(() => {
        if (file) {
            setLoading(true);
            setErr(null);
            fireOnce();
        }
    }, [fireOnce, file]);

    useEffect(() => {
        if (file) {
            // fire...
            handleUpload();
        }
    }, [file]);

    return <>
        <Box height={0} position="sticky" top={0} overflow="visible">
            {loading && <LinearProgress />}
        </Box>
        <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}>
            <Alert severity="error" variant="filled">文件上传时遇到问题: {err?.message || '未知错误'}</Alert>
        </Snackbar>
    </>
}

export default ClipboardImageHandler;