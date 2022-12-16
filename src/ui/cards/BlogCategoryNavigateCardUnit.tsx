import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

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
                <Typography color="primary"
                    variant="body1"
                    fontWeight="bolder">
                    {`${categoryRecord.name} (${categoryRecord.postsCount})`}
                </Typography>
            </Box>
        </Paper>

    </ButtonBase>
}

export default BlogCategoryNavigateCardUnit;