import { Edit } from "@mui/icons-material";
import { Box, Button, ButtonBase, Link, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { blogUserContext } from "../../context/userContext";

function BlogSummaryCardMain({ blogSummaryData }: {
    blogSummaryData: BlogSummaryData
}) {
    const { user } = useContext(blogUserContext);

    const navigate = useNavigate();

    return <Paper>
        <Box px={2} py={1} zIndex={1}>
            <Link variant="h6"
                gutterBottom
                fontWeight="bolder"
                component={ReactRouterLink}
                to={`/blog/${blogSummaryData.id}`}
                underline="hover"
                borderBottom={1}
                borderColor="divider"
                display="block"
            >
                {blogSummaryData.title}
            </Link>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                🖊️ 作者: <Link component={ReactRouterLink} underline="hover"
                    to={`/author/${encodeURI(blogSummaryData.author)}`}
                >{blogSummaryData.author}</Link>

                {!!blogSummaryData.category && <>
                    {' │ '}
                    📂 分类: <Link component={ReactRouterLink} underline="hover"
                        to={`/author/${encodeURI(blogSummaryData.category)}`}
                    >{blogSummaryData.category}</Link>
                </>}

                {blogSummaryData.tags.length > 0 && (
                    <>
                        {' │ '}
                        🏷️ 标签: {blogSummaryData.tags.map((v, i) => (
                            <span key={i}>
                                <Link component={ReactRouterLink} underline="hover"
                                    to={`/tag/${encodeURI(v)}`}
                                >{v}</Link>
                                {' '}
                            </span>
                        ))}
                    </>
                )}

                {' │ '}
                {blogSummaryData.createdAt.toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom whiteSpace="pre-wrap">
                {blogSummaryData.summary}
            </Typography>
            {/* NOTE: 这里暂时用了用户名比对来比较作者。 */}
            {(typeof user === 'object' && (user.username === blogSummaryData.author || user.flags.includes('ADMIN'))) && (
                <Box display='flex' justifyContent='end' flexWrap='wrap' >
                    <Button size="small"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/editor/edit/${blogSummaryData.id}`)}
                        children="编辑"
                    />
                </Box>
            )}
        </Box>
    </Paper>;
}

export default BlogSummaryCardMain;