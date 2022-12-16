import { Box, ButtonBase, Link, Paper, Typography } from "@mui/material";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

function BlogCategoryNavigateCardUnit({ categoryRecord }: {
    categoryRecord: CategoryRecord
}) {

    const navigate = useNavigate();

    return <ButtonBase sx={{
        textAlign: 'unset',
        display: 'block',
        borderRadius: (theme) => `${theme.shape.borderRadius}px`
    }}
        onClick={() => navigate(`/category/${encodeURI(categoryRecord.name)}`)}
    >
        <Paper>
            <Box px={2} py={1}>
                <Link
                    component={ReactRouterLink}
                    to={`/category/${encodeURI(categoryRecord.name)}`}
                    variant="body1" underline="hover" fontWeight="bolder">
                    {`${categoryRecord.name} (${categoryRecord.postsCount})`}
                </Link>
            </Box>
        </Paper>

    </ButtonBase>
}

export default BlogCategoryNavigateCardUnit;