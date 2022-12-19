import { Box, Container, Fade, Grid, Paper, Portal, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
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
import { useCallback, useRef } from "react";

function MainPage() {

    const categoryComponentsRender = useCallback(({ data }: { data: CategoryListData }) => {
        return <Fade in>
            <Stack spacing={1} marginBottom={2}>
                {data.map((v, i) =>
                    <BlogCategoryNavigateCardUnit key={i}
                        categoryRecord={v} />
                )}
            </Stack>
        </Fade>
    }, []);

    const tafComponentsRender = useCallback(({ data }: { data: TagListData }) => {
        return <Fade in>
            <Box>
                <BlogChipNavigate tagList={data} />
            </Box>
        </Fade>
    }, []);

    const mobileUserDisplayContainerRef = useRef<HTMLDivElement>(null);
    const regularUserContainer = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return <>
        <NavBar showSearchBar />

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
                        <Box ref={mobileUserDisplayContainerRef} pb={isMobile ? 2 : 0} />
                        {Outlet({}) || <MainArticleList />}
                    </Grid>

                    {/* 右栏: 小型用户面板 + 分类 + 标签 */}
                    <Grid item xs={12} sm={4}>

                        <Portal container={isMobile ? mobileUserDisplayContainerRef.current : regularUserContainer.current}>
                            <UserSideCard />
                        </Portal>

                        <Box ref={regularUserContainer}>

                        </Box>

                        <Box display="flex" alignItems="center" pb={1}>
                            <Folder fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                分类
                            </Typography>
                        </Box>

                        <AsyncLoadingHandler asyncFunc={APIService.getBlogCategoryList}
                            OnSuccessRender={categoryComponentsRender} />

                        <Box display="flex" alignItems="center" pb={1}>
                            <LocalOffer fontSize="medium" sx={{ mr: 1 }} />
                            <Typography variant="h5" display="inline-block" fontWeight="bolder" alignContent="baseline">
                                标签
                            </Typography>
                        </Box>

                        <AsyncLoadingHandler asyncFunc={APIService.getBlogTagList}
                            OnSuccessRender={tafComponentsRender} />

                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>
}

export default MainPage;