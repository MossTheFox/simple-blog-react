import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import MainArticleList from "./routes/articleList/MainArticleList";
import BlogPost from "./routes/blogPost/BlogPost";
import MainPage from "./routes/MainPage";
import NotFound from "./routes/NotFound";
import MainContainer from "./ui/MainContainer";
import WrappedThemeProvider from "./ui/WrappedThemeProvider";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <NotFound />,
        children: [
            {
                path: 'blog/:id',
                element: <BlogPost />
            },
            {
                path: 'author/:authorName',
                element: <MainArticleList mode="author" />
            },
            {
                path: 'category/:categoryName',
                element: <MainArticleList mode="category" />
            },
            {
                path: 'tag/:tagName',
                element: <MainArticleList mode="tag" />
            },
            {
                path: 'search/:searchText',
                element: <MainArticleList mode="search" />
            }
        ]
    },
    {
        // profile page
        path: '/my',
        errorElement: <NotFound />,

        // elements TODO
        children: [
            {
                path: 'editor',
                children: [
                    {
                        path: 'new'
                    },
                    {
                        path: 'edit/:id'
                    }
                ]
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <WrappedThemeProvider>
            <CssBaseline />
            <MainContainer>
                <Box minHeight={"100vh"}> {/* minHeight="calc(100vh - 10rem)" */}
                    {/* MAIN */}
                    <UserContextProvider>
                        <RouterProvider router={router} />
                    </UserContextProvider>
                </Box>
            </MainContainer>
        </WrappedThemeProvider>
    </React.StrictMode>
);
