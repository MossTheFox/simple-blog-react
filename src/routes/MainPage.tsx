import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import BlogCategoryNavigateCardUnit from "../ui/cards/BlogCategoryNavigateCardUnit";
import BlogChipNavigate from "../ui/cards/BlogChipNavigate";
import BlogSummaryCardMain from "../ui/cards/BlogSummaryCardMain";
import MainBanner from "../ui/decorations/MainBanner";
import { Outlet } from 'react-router-dom';
import { blogCategoryListTestData, blogSummaryTestData, blogTagListTestData } from "../_testData";
import { Folder, LocalOffer } from "@mui/icons-material";
import NavBar from "../ui/NavBar";

function MainPage() {
    return <>
        <NavBar />

        <Container maxWidth="lg">
            <Box py={2}>
                {/* Top Banner */}
                <Paper sx={{ overflow: 'hidden', mb: 4 }}>
                    <MainBanner />
                </Paper>

                {/* Contents */}
                <Grid container spacing={4}>
                    {/* 左栏: 近期文章 (所有文章 + 翻页) | 文章内容 | 按标签查找的文章 | 按作者查找的文章 | 按分类查找的文章 */}
                    <Grid item xs={12} sm={8}>
                        {Outlet({}) || (<>
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
                        </>)}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box display="flex" alignItems="center" pb={1}>
                            <Folder fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                分类
                            </Typography>
                        </Box>
                        <Stack spacing={1} marginBottom={2}>
                            {blogCategoryListTestData.map((v, i) =>
                                <BlogCategoryNavigateCardUnit key={i}
                                    categoryRecord={v} />
                            )}
                        </Stack>

                        <Box display="flex" alignItems="center" pb={1}>
                            <LocalOffer fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                标签
                            </Typography>
                        </Box>

                        <BlogChipNavigate tagList={blogTagListTestData} />

                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
}

export default MainPage;