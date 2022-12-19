import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, Link as ReactRouterLink, useParams } from "react-router-dom";
import { PLACEHOLDER_AVATAR_URL } from "../constants";
import { blogUserContext } from "../context/userContext";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../hooks/AsyncLoadingHandler";
import useAsync from "../hooks/useAsync";
import { APIService } from "../scripts/dataAPIInterface";
import UserProfileAvatar from "../ui/decorations/UserProfileAvatar";
import BigAvatar from "../ui/forms/BigAvatar";
import NavBar from "../ui/NavBar";
import DialogLoadingIndicator from "../ui/smallComponents/DialogLoadingIndicator";
import MyArticlesSubPage from "./articleList/MyArticlesSubPage";

function VisitorProfilePage() {

    const { user } = useContext(blogUserContext);

    const { username } = useParams();

    const navigate = useNavigate();

    const goBackOrgoHome = useCallback(() => {
        if (history.length > 1) {
            history.back();
            return;
        }
        navigate('/');
    }, []);

    useEffect(() => {
        if (user !== 'Not Login' && user.username === username) {
            navigate('/my', { replace: true });
        }
    }, [username, user]);

    const [currentUser, setCurrentUser] = useState<(BlogUserCore & BlogUserData) | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const asyncFetchProfileData = useCallback(async () => {
        if (!username) throw new Error('没有有效的用户名');
        return await APIService.getUserProfile(username);
    }, [username]);

    const fetchOnSuccess = useCallback((data: BlogUserCore & BlogUserData) => {
        setLoading(false);
        setError(null);
        setCurrentUser(data);
    }, [])

    const fetchOnError = useCallback((e: Error) => {
        setLoading(false);
        setError(e);
    }, []);

    const fireOnce = useAsync(asyncFetchProfileData, fetchOnSuccess, fetchOnError);

    const handleFetchUser = useCallback(() => {
        setLoading(true);
        setError(null);
        fireOnce();
    }, [fireOnce]);

    useEffect(() => {
        handleFetchUser();
    }, []);



    return <>
        <NavBar showSearchBar />
        <Container maxWidth="lg">
            <Box pb={2}>
                <Button onClick={goBackOrgoHome}
                    startIcon={<ArrowBack />}
                    children={'返回上一页'} />
            </Box>
            <Box py={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5} md={4} lg={3} justifyContent="center">

                        {currentUser && <>
                            <UserProfileAvatar
                                src={currentUser.avatar === PLACEHOLDER_AVATAR_URL ? PLACEHOLDER_AVATAR_URL : APIService.parseResourceUrl(currentUser.avatar)}
                                username={currentUser.username}
                            />
                            <Divider />
                            <DialogLoadingIndicator loading={loading} />

                            <Box my={2}>

                                {currentUser && <>
                                    <Typography variant="h5" fontWeight='bolder' gutterBottom>
                                        {currentUser.username}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {currentUser.signature || '没有设置签名……'}
                                    </Typography>
                                    {currentUser.flags.includes('ADMIN') && (
                                        <Typography variant="body2" gutterBottom>
                                            管理员
                                        </Typography>
                                    )}
                                </>}
                            </Box>
                        </>}
                        {loading && <TemplateLoadingPlaceHolder />}
                        {error && <TemplateOnErrorRender
                            message={error.message}
                            title='获取用户信息出错'
                            retryFunc={handleFetchUser} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={7} md={8} lg={9}>
                        {currentUser &&
                            <MyArticlesSubPage username={currentUser.username} />
                        }
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
}


export default VisitorProfilePage;
