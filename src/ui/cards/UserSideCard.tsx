import { AccountCircle, ArrowBack, BorderColor } from "@mui/icons-material";
import { Avatar, Box, Button, Collapse, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { blogUserContext } from "../../context/userContext";
import UserLoginForm from "../forms/UserLoginForm";
import UserSignOffButton from "../forms/UserSignOffButton";

function UserSideCard() {
    const { user, set } = useContext(blogUserContext);

    const [loginFormOpen, setLoginFormOpen] = useState(false);

    const [registerFormOpen, setRegisterFormOpen] = useState(false);

    const navigate = useNavigate();

    return <Box pb={2}>
        <Box display="flex" alignItems="center" pb={1}>
            {typeof user === 'object' ? (
                <Avatar alt={user.username} src={user.avatar} sx={{ width: '1.5rem', height: '1.5rem', mr: 1 }} />
            ) : (
                <AccountCircle fontSize="medium" sx={{ mr: 1 }} />
            )}

            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                {typeof user === 'object' ? user.username : '用户'}
            </Typography>
        </Box>

        {user === 'Not Login' ? <>
            <Collapse in={loginFormOpen}>
                <UserLoginForm mb={3} />
                <Button size="small" startIcon={<ArrowBack />} variant="outlined" onClick={() => { setLoginFormOpen(false) }} children="返回" />

            </Collapse>
            <Collapse in={!loginFormOpen}>
                <Button size="small" fullWidth variant="outlined" onClick={() => { setLoginFormOpen(true) }} children="登录" />
            </Collapse>
        </>
            : <Stack spacing={2}>
                <Button fullWidth startIcon={<BorderColor />} children="发布文章" variant="contained"
                    onClick={() => navigate('/editor/new')}
                />
                <Button fullWidth startIcon={<AccountCircle />} children="个人信息" variant="contained"
                    onClick={() => navigate('/my')}
                />

                <Box textAlign="end">
                    <UserSignOffButton variant="text" size="small">注销登陆</UserSignOffButton>
                </Box>
            </Stack>}
    </Box>
}

export default UserSideCard;