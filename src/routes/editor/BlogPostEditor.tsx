import { Send } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, Grid, Stack, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogUserContext } from "../../context/userContext";
import AsyncLoadingHandler, { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { APIService } from "../../scripts/dataAPIInterface";
import CategorySelector, { createNewCategoryKey } from "../../ui/forms/CategorySelector";
import TagSelector from "../../ui/forms/TagSelector";
import NavBar from "../../ui/NavBar";
import MarkdownEditor from "./MarkdownEditor";

export const initBlogEditorData: BlogPostEditorData = {
    allowComment: true,
    title: '文章标题',
    summary: '这里的文字会显示在文章卡片上。',
    category: '默认',
    tags: [],
    content: '使用 [Markdown](https://www.markdownguide.org/cheat-sheet/) 格式来撰写文章。',
};

function BlogPostEditor({ mode, submitCallback, actionMenuCallback }: {
    mode: 'new' | 'edit';
    submitCallback: (data: BlogPostEditorData) => void;
    actionMenuCallback: () => void;
}) {
    // TODO: 保存草稿 (localStorage | Origin Private File System)
    const { user, set } = useContext(blogUserContext);

    /** 编辑模式下使用 */
    const { id } = useParams();

    const [blogData, setBlogData] = useState<BlogPostEditorData>(initBlogEditorData);

    const updateBlogData = useCallback((key: keyof BlogPostEditorData, value: BlogPostEditorData[typeof key]) => {
        setBlogData((prev) => {
            let newObject = {
                ...prev,
                [key]: value
            }
            return newObject;
        });
    }, []);

    /** 编辑模式下，会等待加载结束 */
    const [loading, setLoading] = useState(mode === 'edit');
    const [err, setError] = useState<Error | null>(null);

    const asyncFunc = useCallback(async () => {
        if (typeof id === 'undefined' || isNaN(+id)) throw new Error('无效的 ID');
        return await APIService.getBlogFullDataById(id);
    }, [id]);

    const onSuccess = useCallback((fetchedData: BlogPostData) => {
        setLoading(false);
        setError(null);
        setBlogData({
            title: fetchedData.title,
            summary: fetchedData.summary,
            allowComment: fetchedData.allowComment,
            category: fetchedData.category,
            content: fetchedData.content,
            tags: fetchedData.tags
        });
    }, []);

    const onError = useCallback((err: Error) => {
        setLoading(false);
        setError(err);
    }, []);

    const fireOnce = useAsync(asyncFunc, onSuccess, onError);

    useEffect(() => {
        if (mode === 'edit') {
            fireOnce();
        }
    }, [mode, fireOnce]);

    const [showCatInput, setShowCatInput] = useState(mode === 'new');
    const [catInput, setCatInput] = useState('');

    const updateCatInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCatInput(e.target.value);
    }, []);

    /** 一些 Callback */
    const updateCategory = useCallback((cat: string) => {
        if (cat === createNewCategoryKey) {
            setShowCatInput(true);
            updateBlogData('category', catInput);
            return;
        }
        setShowCatInput(false);
        updateBlogData('category', cat);
    }, [updateBlogData, catInput]);

    useEffect(() => {
        updateBlogData('category', catInput);
    }, [catInput, updateBlogData]);


    const updateMarkdown = useCallback((md: string) => {
        updateBlogData('content', md);
    }, [updateBlogData]);

    const updateTags = useCallback((tags: string[]) => {
        updateBlogData('tags', tags);
    }, [updateBlogData]);

    const insertNewTag = useCallback((newTag: string) => {
        setBlogData((prevFull) => {
            let prev = prevFull.tags;
            let set = new Set<string>([...prev, newTag]);
            prev = Array.from(set);
            return {
                ...prevFull,
                tags: prev
            }
        })
    }, []);

    const deleteTag = useCallback((tag: string | number) => {
        setBlogData((prevFull) => {
            let prev = prevFull.tags;
            let index = typeof tag === 'number' ? tag : (prev.findIndex((v) => v === tag));
            if (index === -1) return { ...prevFull };
            let newArray = [...prev];
            newArray.splice(index, 1);
            prev = newArray;
            return {
                ...prevFull,
                tags: prev
            }
        });
    }, []);

    return <>
        <Container maxWidth="xl">
            <Box py={2}>
                {loading && <TemplateLoadingPlaceHolder />}
                {(!loading && err) && <TemplateOnErrorRender />}
                {(!loading && !err) &&
                    <>
                        <Stack spacing={2} mb={2}>
                            <Box>
                                <Box display="flex" justifyContent='space-between'>
                                    <Typography variant="h5" fontWeight="bolder" gutterBottom>文章编辑器</Typography>
                                    <Box display="flex" gap={2} flexWrap="wrap">
                                        {mode === 'edit' &&
                                            <Button variant="text"
                                                onClick={actionMenuCallback}>
                                                其他操作
                                            </Button>
                                        }
                                        <Button variant="contained"
                                            startIcon={<Send />}
                                            onClick={() => submitCallback(blogData)}>
                                            {mode === 'edit' ? '提交修改' : '发布文章'}
                                        </Button>
                                    </Box>
                                </Box>
                                <Typography variant="body2" gutterBottom color="textSecondary">发布者: {(typeof user === 'object') ? user.username : '未登录'}</Typography>
                                {mode === 'edit' &&
                                    <Typography variant="body2" gutterBottom color="textSecondary">
                                        文章 ID: {id}
                                    </Typography>
                                }
                            </Box>
                            <TextField
                                variant="filled"
                                label="标题"
                                fullWidth
                                autoComplete="off"
                                value={blogData.title}
                                onChange={(e) => updateBlogData('title', e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                size="small"
                                label="摘要"
                                autoComplete="off"
                                fullWidth
                                multiline
                                minRows={2}
                                value={blogData.summary}
                                onChange={(e) => updateBlogData('summary', e.target.value)}
                            />
                        </Stack>
                        <Box pb={2}>
                            <Typography variant="h6" fontWeight="bolder" gutterBottom>评论开关</Typography>
                            <FormControlLabel control={
                                <Checkbox checked={blogData.allowComment} onChange={(e, c) => updateBlogData('allowComment', c)} />}
                                label="允许评论" />
                        </Box>
                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" fontWeight="bolder" gutterBottom>分类</Typography>
                                <CategorySelector
                                    setSelected={updateCategory}
                                    initialData={blogData.category}
                                />
                                <Box hidden={!showCatInput} py={1}>
                                    <TextField variant="standard" size="small" label="分类名称" fullWidth
                                        value={catInput}
                                        onChange={updateCatInput}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" fontWeight="bolder" gutterBottom>标签</Typography>
                                <TagSelector setTags={updateTags}
                                    tags={blogData.tags}
                                    insert={insertNewTag}
                                    deleteOne={deleteTag}
                                />
                            </Grid>
                        </Grid>

                        <MarkdownEditor
                            initialValue={blogData.content}
                            updateCallback={updateMarkdown} />
                    </>
                }
            </Box>

        </Container>
    </>
}

export default BlogPostEditor;