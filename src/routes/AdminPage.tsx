import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogUserContext } from "../context/userContext";
import NavBar from "../ui/NavBar";
import PassedCommentList from "./admin/PassedCommentList";
import ToBeVerifiedCommentList from "./admin/ToBeVerifiedCommentList";

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


    return user === 'Not Login' ? <></> : <>
        <NavBar showSearchBar />
        <Container maxWidth="lg">
            <Box py={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={7} md={8} lg={9}>
                        {mode === 'passed' ? (
                            <PassedCommentList selectCallback={onCommentSelected} />
                        ) : (
                            <ToBeVerifiedCommentList selectCallback={onCommentSelected} />

                        )}
                    </Grid>
                    <Grid item xs={12} sm={5} md={4} lg={3} justifyContent="center" ref={divRef}>

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
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
}


export default AdminPage;
