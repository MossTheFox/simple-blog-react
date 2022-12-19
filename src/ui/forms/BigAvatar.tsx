import { Alert, Avatar, Box, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Edit } from "@mui/icons-material";

import { blogUserContext } from "../../context/userContext";
import { PLACEHOLDER_AVATAR_URL } from "../../constants";
import { APIService } from "../../scripts/dataAPIInterface";
import useAsync from "../../hooks/useAsync";

function BigAvatar({
    showEditButton = true,
}) {
    const { user, set } = useContext(blogUserContext);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState<{ severity: 'error' | 'success', message: string }>({
        severity: 'success',
        message: '?'
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const setOpenCallback = useCallback((bool: boolean) => {
        setEditDialogOpen(bool);
    }, []);


    const ref = useRef<HTMLInputElement>(null);

    const [fileObject, setFileObject] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);

    const asyncUploadFile = useCallback(async () => {
        if (!fileObject) throw new Error('没有选择文件');
        return await APIService.updateAvatar(fileObject);
    }, [fileObject]);

    const onSuccess = useCallback((url: string) => {
        set({
            avatar: url
        })
        setLoading(false);
        setErr(null);
        setFileObject(null);
        setNotification({
            severity: 'success',
            message: '头像更新成功'
        });
    }, [set]);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
        setNotification({
            severity: 'error',
            message: '发生错误: ' + e.message
        });
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

    return <Box p={2} width='100%'
        sx={{
            position: "relative",
        }}
    >
        {typeof user === 'object' && (<>

            <Box width="100%" position="relative" mb={2}
                sx={{
                    '::after': {
                        content: `""`,
                        display: 'block',
                        pb: '100%'
                    }
                }}
            >
                <Avatar alt={`${user.username} avatar`} 
                src={user.avatar === PLACEHOLDER_AVATAR_URL ? PLACEHOLDER_AVATAR_URL : APIService.parseResourceUrl(user.avatar)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        objectFit: 'cover'
                    }}
                />
            </Box>
            {showEditButton && <>
                <Tooltip title="修改头像" arrow
                    enterTouchDelay={0}
                >
                    <IconButton
                        aria-label="修改头像"
                        size="medium"
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: "100%",
                            transform: "translate(-100%, -100%)",
                        }}
                        disabled={loading}
                        onClick={openPicker}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
                {/* <AvatarUpdateDialog
                    isOpen={editDialogOpen}
                    setOpen={setOpenCallback}
                /> */}
            </>
            }
            <input ref={ref} type='file' hidden
                onChange={onChange}
            />

            <Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}>
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </>
        )}
    </Box>
}

export default BigAvatar;