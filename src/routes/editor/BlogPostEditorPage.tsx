import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogUserContext } from "../../context/userContext";
import CategorySelector from "../../ui/forms/CategorySelector";
import TagSelector from "../../ui/forms/TagSelector";
import NavBar from "../../ui/NavBar";
import MarkdownEditor from "./MarkdownEditor";

function BlogPostEditorPage({ mode }: { mode: 'new' | 'edit' }) {
    // TODO: 保存草稿 (localStorage | Origin Private File System)

    const { user, set } = useContext(blogUserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (typeof user === 'string') {
            navigate('/', {
                replace: true
            })
        }
    }, [navigate, user])

    return <>
        <NavBar maxWidth="xl" position="static" />
        <Container maxWidth="xl">
            <Box py={2}>
                <Stack spacing={1} mb={2}>
                    <Box>
                        <Typography variant="h5" fontWeight="bolder" gutterBottom>文章编辑器</Typography>
                        <Typography variant="body2" gutterBottom color="textSecondary">发布者: {(typeof user === 'object') ? user.username : '未登录'}</Typography>
                    </Box>
                    <TextField
                        variant="filled"
                        label="标题"
                        fullWidth
                        autoComplete="off"
                    />
                    <TextField
                        variant="outlined"
                        size="small"
                        label="摘要"
                        autoComplete="off"
                        fullWidth
                        multiline
                        minRows={2}
                    />
                </Stack>

                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" fontWeight="bolder" gutterBottom>分类</Typography>
                        <CategorySelector />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" fontWeight="bolder" gutterBottom>标签</Typography>
                        <TagSelector />
                    </Grid>
                </Grid>

                <MarkdownEditor />
            </Box>

        </Container>
    </>
}

export default BlogPostEditorPage;