import { Box, ButtonBase, Link, Paper, Typography } from "@mui/material";
import { Link as ReactRouterLink } from 'react-router-dom';

function BlogSummaryCardMain({ blogSummaryData }: {
    blogSummaryData: BlogSummaryData
}) {

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
                                    to={`/author/${encodeURI(v)}`}
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
        </Box>
    </Paper>;
}

export default BlogSummaryCardMain;