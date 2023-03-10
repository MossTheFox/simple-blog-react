import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { ADMIN_FLAG } from "../constants";
import { blogUserContext } from "../context/userContext";
import { TemplateOnErrorRender } from "../hooks/AsyncLoadingHandler";
import useAsync from "../hooks/useAsync";
import { APIService } from "../scripts/dataAPIInterface";
import BigAvatar from "../ui/forms/BigAvatar";
import ChangePasswordDialog from "../ui/forms/ChangePasswordDialog";
import NavBar from "../ui/NavBar";
import DialogLoadingIndicator from "../ui/smallComponents/DialogLoadingIndicator";
import MyArticlesSubPage from "./articleList/MyArticlesSubPage";

function ProfilePage() {

    const { user, set } = useContext(blogUserContext);

    const navigate = useNavigate();

    const [profieEdit, setProfileEdit] = useState(false);

    const [sigInput, setSigInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const openProfileEdit = useCallback(() => {
        if (user === 'Not Login') return;
        setSigInput(user.signature);
        setProfileEdit(true);
    }, [user])

    const asyncSubmitNewSignatuer = useCallback(async () => {
        return await APIService.updateProfile({ signature: sigInput });
    }, [sigInput]);

    const submitOnSuccess = useCallback((data: Partial<BlogUserData>) => {
        setLoading(false);
        setError(null);
        set({ signature: data.signature ?? '' });
        setProfileEdit(false);
    }, [set])

    const submitOnError = useCallback((e: Error) => {
        setLoading(false);
        setError(e);
    }, []);

    const fireOnce = useAsync(asyncSubmitNewSignatuer, submitOnSuccess, submitOnError);

    const handleSubmit = useCallback(() => {
        setLoading(true);
        setError(null);
        fireOnce();
    }, [fireOnce]);

    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    // password dialog
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const openChangePasswordDialog = useCallback(() => {
        setPasswordDialogOpen(true);
    }, []);

    return <>
        {user === 'Not Login' ? <>
            <Container maxWidth="md">
                <Box py={10}>
                    <Paper>
                        <Box px={2} py={4}>
                            <Typography
                                textAlign="center"
                                variant="h5" fontWeight="bolder" gutterBottom>
                                ???????????????
                            </Typography>
                            <Typography textAlign="center">
                                ?????????<Link component={ReactRouterLink} to="/"
                                    underline="hover"
                                >???????????????????????????</Link>???
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
                        <Grid item xs={12} sm={5} md={4} lg={3} justifyContent="center">
                            <BigAvatar />
                            <Divider />
                            <DialogLoadingIndicator loading={loading} />

                            <Box my={2}>

                                {!profieEdit && <>
                                    <Typography variant="h5" fontWeight='bolder' gutterBottom>
                                        {user.username}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {user.signature || '????????????????????????'}
                                    </Typography>
                                    {user.flags.includes(ADMIN_FLAG) && (
                                        <Typography variant="body2" gutterBottom>
                                            ?????????
                                        </Typography>
                                    )}
                                    <Button fullWidth variant="contained" color="primary" sx={{ mb: 2 }}
                                        onClick={openProfileEdit}>??????????????????</Button>


                                    {user.flags.includes(ADMIN_FLAG) &&
                                        <Button fullWidth children="????????????" variant="outlined"
                                            onClick={() => navigate('/admin')}
                                        />
                                    }
                                </>}
                                {profieEdit && <>
                                    <Stack spacing={2} mb={4}>
                                        <Box>
                                            <Button variant="outlined"
                                                onClick={() => setProfileEdit(false)}
                                                disabled={loading}
                                                startIcon={<ArrowBack />}
                                                children="??????"
                                            />
                                        </Box>

                                        <TextField label="????????????" size="small"
                                            value={sigInput}
                                            autoComplete='off'
                                            onChange={(e) => setSigInput(e.target.value.substring(0, 200))}
                                            disabled={loading}
                                        />

                                        {error && <TemplateOnErrorRender
                                            message={error.message}
                                            retryFunc={handleSubmit} />}

                                        <Button variant="contained"
                                            children="??????"
                                            disabled={loading}
                                            onClick={handleSubmit}
                                        />
                                    </Stack>
                                    <Box textAlign='end'>
                                        <Button variant="outlined" size="small" color="secondary" sx={{ mb: 2 }}
                                            onClick={openChangePasswordDialog}>??????????????????</Button>
                                    </Box>
                                    <ChangePasswordDialog open={passwordDialogOpen} setOpen={setPasswordDialogOpen} />
                                </>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={7} md={8} lg={9}>
                            <MyArticlesSubPage username={user.username} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>}
    </>
}


export default ProfilePage;
