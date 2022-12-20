import { ArrowBack, Edit } from "@mui/icons-material";
import { Box, Button, Divider, Fade, Link, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { blogUserContext } from "../../context/userContext";
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { APIService } from "../../scripts/dataAPIInterface";
import { markdownGetReactDOMs } from "../../utils/markdownTools";
import BlogPostComment from "./BlogPostComment";

function BlogPost() {

    const { id } = useParams();
    const navigate = useNavigate();

    const goBackOrgoHome = useCallback(() => {
        if (history.length > 1) {
            history.back();
            return;
        }
        navigate('/');
    }, []);

    const [showEditButton, setShowEditButton] = useState(false);

    const asyncGetBlogPostData = useCallback(async () => {
        // um
        if (!id || (Number.isNaN(+id))) throw new Error('无效的文章 ID。');
        return await APIService.getBlogFullDataById(id);
    }, [id]);


    // 评论相关
    const [allowComment, setAllowComment] = useState<'pending' | boolean>('pending');


    // 这样保证不会反复 rerender... 
    const onSuccessRender = useCallback(function BlogPostRender({ data }: { data: BlogPostData }) {
        const { user } = useContext(blogUserContext);

        useEffect(() => {
            setAllowComment(data.allowComment);
            if (typeof user === 'object') {
                setShowEditButton((user.username === data.author || user.flags.includes('ADMIN')));
                return;
            }
            setShowEditButton(false);
        }, [data, user, setShowEditButton, setAllowComment])

        return <Fade in={true}>
            <Box pb={2}>
                <Typography variant="h4" fontWeight='bolder' gutterBottom
                    borderBottom={1} borderColor="divider" textAlign='center'
                >{data.title}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom
                    textAlign='center'
                >
                    作者: <Link component={ReactRouterLink} underline="hover"
                        to={`/author/${encodeURI(data.author)}`}
                    >{data.author}</Link>

                    {!!data.category && <>
                        {' │ '}
                        分类: <Link component={ReactRouterLink} underline="hover"
                            to={`/author/${encodeURI(data.category)}`}
                        >{data.category}</Link>
                    </>}
                </Typography>
                <Typography variant="body2" color="textSecondary"
                    gutterBottom
                    textAlign='center'
                >
                    {data.tags.length > 0 && (
                        <>
                            标签: {data.tags.map((v, i) => (
                                <span key={i}>
                                    <Link component={ReactRouterLink} underline="hover"
                                        to={`/tag/${encodeURI(v)}`}
                                    >{v}</Link>
                                    {' '}
                                </span>
                            ))}
                        </>
                    )}
                </Typography>
                <Typography variant="body2" color="textSecondary"
                    gutterBottom
                    textAlign='center'
                >
                    {data.createdAt.toLocaleString()}
                    {(data.lastModified.getTime() !== data.createdAt.getTime()) && (<>
                        <br />
                        最后编辑于: {data.lastModified.toLocaleString()}
                    </>
                    )}
                </Typography>

                {markdownGetReactDOMs(data.content)}
            </Box>
        </Fade>;
    }, [setShowEditButton, setAllowComment]);

    /** 选择评论回复会用的部分 */

    return <Box>
        <Box pb={2} display="flex" justifyContent='space-between'>
            <Button onClick={goBackOrgoHome}
                variant="outlined"
                startIcon={<ArrowBack />}
                children={'返回上一页'}
                size="small"
            />
            {showEditButton &&
                <Button size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/editor/edit/${id}`)}
                    children="编辑"
                />
            }
        </Box>

        <AsyncLoadingHandler asyncFunc={asyncGetBlogPostData} OnSuccessRender={
            onSuccessRender
        } />

        <Box py={2}>
            <Divider />
        </Box>

        {/* 评论 */}
        <Box pb={2}>
            {typeof allowComment === 'boolean' && <>
                {(id && allowComment) ? (<BlogPostComment blogId={+id} />
                ) : (
                    <Typography variant='body2' color="textSecondary" gutterBottom>
                        评论已关闭
                    </Typography>
                )}
            </>}
        </Box>

    </Box>
}

export default BlogPost;