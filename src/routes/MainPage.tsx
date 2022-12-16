import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import BlogCategoryNavigateCardUnit from "../ui/cards/BlogCategoryNavigateCardUnit";
import BlogChipNavigate from "../ui/cards/BlogChipNavigate";
import BlogSummaryCardMain from "../ui/cards/BlogSummaryCardMain";
import MainBanner from "../ui/decorations/MainBanner";
import { blogCategoryListTestData, blogSummaryTestData, blogTagListTestData } from "../_testData";

function MainPage() {
    return <Container maxWidth="lg">
        <Box py={2}>
            {/* Top Banner */}
            <Paper sx={{ overflow: 'hidden', mb: 4 }}>
                <MainBanner />
            </Paper>

            {/* Contents */}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                    <Typography variant="h5" fontWeight="bolder" gutterBottom
                        sx={{
                            textIndent: (theme) => theme.spacing(2),
                        }}
                    >
                        近期文章
                    </Typography>
                    <Stack spacing={2}>
                        <BlogSummaryCardMain blogSummaryData={blogSummaryTestData} />
                        <BlogSummaryCardMain blogSummaryData={blogSummaryTestData} />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="h5" fontWeight="bolder" gutterBottom
                    >
                        📂 分类
                    </Typography>
                    <Stack spacing={1} marginBottom={2}>
                        {blogCategoryListTestData.map((v, i) =>
                            <BlogCategoryNavigateCardUnit key={i}
                                categoryRecord={v} />
                        )}
                    </Stack>

                    <Typography variant="h5" fontWeight="bolder" gutterBottom
                    >
                        🏷️ 标签
                    </Typography>

                    <BlogChipNavigate tagList={blogTagListTestData} />

                </Grid>
            </Grid>
        </Box>
    </Container>
}

export default MainPage;