import { Box, BoxProps, Button, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { blogUserContext } from "../../context/userContext";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";

function UserLoginForm(props: BoxProps) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { user, set } = useContext(blogUserContext);

    const [loading, setLoading] = useState(false);
    const [err, setError] = useState<Error | null>(null);

    const handleInputChange = useCallback((input: string, field: 'username' | 'password') => {
        setError(null);
        switch (field) {
            case 'username':
                setUsername(input);
                return;
            case 'password':
                setPassword(input);
                return;
        }
    }, []);


    const asyncHandleFormSubmit = useCallback(async () => {
        if (!username || !password) throw new Error('请填写' + (!username ? '用户名' : '密码') + '。');
        return await APIService.loginViaUsernameAndPassword(username, password);
    }, [username, password]);

    const submitOnSuccess = useCallback((data: Awaited<ReturnType<typeof asyncHandleFormSubmit>>) => {
        setLoading(false);
        setError(null);
        set(data);
    }, [set]);

    const submitOnError = useCallback((err: Error) => {
        setLoading(false);
        setError(err);
    }, []);

    const fireSubmit = useAsync(asyncHandleFormSubmit, submitOnSuccess, submitOnError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setError(null);
        fireSubmit();
    }, []);

    return <Box {...props}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Stack spacing={1} mb={2}>
                <Typography variant='h6' fontWeight="bolder">用户登录</Typography>
                <TextField label="用户名"
                    disabled={loading}
                    autoComplete="username"
                    size="small"
                    value={username}
                    onChange={(e) => { handleInputChange(e.target.value, 'username') }}
                />
                <TextField label="密码"
                    type="password"
                    disabled={loading}
                    autoComplete="current-password"
                    size="small"
                    value={password}
                    onChange={(e) => { handleInputChange(e.target.value, 'password') }}
                />
                <Typography variant="body2">{(!loading && err) ? err.message : ''}</Typography>
            </Stack>
        </form>
        <Button variant="contained" fullWidth onClick={handleSubmit}>登录</Button>
    </Box>
}

export default UserLoginForm;