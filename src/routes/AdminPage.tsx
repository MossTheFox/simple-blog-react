import { Box, Button, Container, Divider, Grid, Link, Paper, Theme, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { ADMIN_FLAG } from "../constants";
import { blogUserContext } from "../context/userContext";
import NavBar from "../ui/NavBar";
import AdminInspectCommentList from "./admin/AdminInspectCommentList";
function AdminPage() {

    const { user, set } = useContext(blogUserContext);

    const navigate = useNavigate();

    const [mode, setMode] = useState<'validate' | 'passed'>('validate');
    const toggle = useCallback(() => {
        setMode((prev) => prev === 'passed' ? 'validate' : 'passed');
    }, []);
    const divRef = useRef<HTMLDivElement>(null);

    const scrollToDiv = useCallback(() => {
        if (!divRef.current) return;
        divRef.current.scrollIntoView({
            behavior: 'smooth'
        });
    }, [divRef]);

    const onCommentSelected = useCallback((comment: BlogComment) => {

    }, []);

    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const panelContainer = useMemo(() => user === 'Not Login' ? null : (<Grid item xs={12} sm={5} md={4} lg={3} justifyContent="center" ref={divRef}>
        <Typography variant="h5" fontWeight='bolder' gutterBottom>
            管理员: {user.username}
        </Typography>

        <Typography variant="body1" color="textSecondary" gutterBottom>
            这里是评论审核页面。
        </Typography>

        <Button fullWidth variant="outlined"
            color={mode === 'passed' ? 'primary' : 'info'}
            sx={{ mb: 2 }}
            onClick={toggle}
        >
            {mode === 'passed' ? '查看未审核的评论' : '查看已通过的评论'}
        </Button>

        <Box py={4}>
            <Divider />
        </Box>
        <Button fullWidth variant="text" color="primary" sx={{ mb: 2 }}
            onClick={() => navigate('/')}
        >返回主页</Button>
    </Grid>), [user, mode, toggle]);

    return (user === 'Not Login' || !user.flags.includes(ADMIN_FLAG)) ? <>
        <Container maxWidth="md">
            <Box py={10}>
                <Paper>
                    <Box px={2} py={4}>
                        <Typography
                            textAlign="center"
                            variant="h5" fontWeight="bolder" gutterBottom>
                            {typeof user === 'object' ? '管理员权限确认失败' : '用户未登录'}
                        </Typography>
                        <Typography textAlign="center">
                            你可以<Link component={ReactRouterLink} to="/"
                                underline="hover"
                            >点击这里来返回首页</Link>。
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    </> : <>
        <NavBar showSearchBar />
        <Container maxWidth="lg">
            <Box py={2}>
                <Grid container spacing={2}>
                    {isMobile && panelContainer}
                    <Grid item xs={12} sm={7} md={8} lg={9}>
                        {mode === 'passed' ? (
                            <AdminInspectCommentList mode='verified' selectCallback={onCommentSelected} />
                        ) : (
                            <AdminInspectCommentList mode='toBeVerified' selectCallback={onCommentSelected} />

                        )}
                    </Grid>
                    {!isMobile && panelContainer}
                </Grid>
            </Box>
        </Container>
    </>
}


export default AdminPage;
