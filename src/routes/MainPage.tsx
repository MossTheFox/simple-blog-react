import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import BlogCategoryNavigateCardUnit from "../ui/cards/BlogCategoryNavigateCardUnit";
import BlogChipNavigate from "../ui/cards/BlogChipNavigate";
import BlogSummaryCardMain from "../ui/cards/BlogSummaryCardMain";
import MainBanner from "../ui/decorations/MainBanner";
import { Outlet } from 'react-router-dom';
import { blogCategoryListTestData, blogSummaryTestData, blogTagListTestData } from "../_testData";
import { Folder, LocalOffer } from "@mui/icons-material";
import NavBar from "../ui/NavBar";
import MainArticleList from "./articleList/MainArticleList";
import AsyncLoadingHandler from "../hooks/AsyncLoadingHandler";
import { APIService } from "../scripts/dataAPIInterface";
import UserSideCard from "../ui/cards/UserSideCard";

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
                        {Outlet({}) || <MainArticleList />}
                    </Grid>

                    {/* 右栏: 小型用户面板 + 分类 + 标签 */}
                    <Grid item xs={12} sm={4}>

                        <UserSideCard />

                        <Box display="flex" alignItems="center" pb={1}>
                            <Folder fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                分类
                            </Typography>
                        </Box>

                        <AsyncLoadingHandler asyncFunc={APIService.getBlogCategoryList}
                            OnSuccessRender={({ data }) => {
                                return <Stack spacing={1} marginBottom={2}>
                                    {data.map((v, i) =>
                                        <BlogCategoryNavigateCardUnit key={i}
                                            categoryRecord={v} />
                                    )}
                                </Stack>
                            }} />

                        <Box display="flex" alignItems="center" pb={1}>
                            <LocalOffer fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                标签
                            </Typography>
                        </Box>

                        <AsyncLoadingHandler asyncFunc={APIService.getBlogTagList}
                            OnSuccessRender={({ data }) => {
                                return <BlogChipNavigate tagList={data} />
                            }} />

                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
}

export default MainPage;