import { InsertPhoto } from "@mui/icons-material";
import { Alert, Button, ButtonProps, Snackbar } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function ImageUploadButton(props: {
    urlCallback: (url: string) => void,
} & ButtonProps) {
    const urlCallback = useMemo(() => props.urlCallback, [props.urlCallback]);
    const btnProps = useMemo(() => {
        let obj: Partial<typeof props> = { ...props };
        delete obj.urlCallback;
        return obj;
    }, [props]);

    const ref = useRef<HTMLInputElement>(null);

    const [fileObject, setFileObject] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const asyncUploadFile = useCallback(async () => {
        if (!fileObject) throw new Error('没有选择文件');
        return await APIService.uploadImageFile(fileObject);
    }, [fileObject]);

    const onSuccess = useCallback((url: string) => {
        urlCallback(APIService.parseResourceUrl(url));
        setLoading(false);
        setErr(null);
        setFileObject(null);
    }, [urlCallback]);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
        setNotificationOpen(true);
    }, []);

    const fireOnce = useAsync(asyncUploadFile, onSuccess, onError);

    const handleUpload = useCallback(() => {
        if (fileObject) {
            setLoading(true);
            setErr(null);
            fireOnce();
        }
    }, [fireOnce, fileObject]);

    const openPicker = useCallback(() => {
        if (ref.current) {
            ref.current.click();
        }
    }, [ref]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFileObject(e.target.files[0]);
            e.target.value = '';
        }
    }, [handleUpload]);

    useEffect(() => {
        if (fileObject) {
            handleUpload();
        }
    }, [fileObject, handleUpload]);

    // err

    return <>
        <Button children="上传图片" variant="contained" startIcon={<InsertPhoto />} {...btnProps}
            onClick={openPicker}
            disabled={loading}
        />

        <input ref={ref} type='file' hidden
            accept="image/*"
            onChange={onChange}
        />

        <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}>
            <Alert severity="error" variant="filled">文件上传时遇到问题: {err?.message || '未知错误'}</Alert>
        </Snackbar>
    </>
}

export default ImageUploadButton;