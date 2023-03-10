import './App.css';
import { Box, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import AdminPage from "./routes/AdminPage";
import MainArticleList from "./routes/articleList/MainArticleList";
import BlogPost from "./routes/blogPost/BlogPost";
import BlogPostEditorPage from "./routes/editor/BlogPostEditorPage";
import MainPage from "./routes/MainPage";
import NotFound from "./routes/NotFound";
import ProfilePage from "./routes/ProfilePage";
import VisitorProfilePage from "./routes/VisitorProfilePage";
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
        element: <ProfilePage />,
        errorElement: <NotFound />,
    },
    {
        path: 'author/:username',
        element: <VisitorProfilePage />
    },
    {
        path: '/admin',
        element: <AdminPage />,
        errorElement: <NotFound />,
    },
    {
        path: '/editor/new',
        element: <BlogPostEditorPage mode='new' />,
        errorElement: <NotFound />
    },
    {
        path: '/editor/edit/:id',
        element: <BlogPostEditorPage mode='edit' />,
        errorElement: <NotFound />
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
