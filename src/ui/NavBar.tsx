import { GitHub, Search } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Container, Link, Breakpoint, useMediaQuery, Theme } from "@mui/material";
import { Link as ReactRouterLink } from 'react-router-dom';
import ArticleSearchBar from "./forms/ArticleSearchBar";


function NavBar({ maxWidth = 'lg', position = "sticky", showSearchBar = false }:
    {
        maxWidth?: Breakpoint,
        position?: "fixed" | "sticky" | "absolute" | "relative" | "static" | undefined,
        showSearchBar?: boolean
    }) {

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <AppBar position={position} color="primary">
            <Container maxWidth={maxWidth}>
                <Toolbar>
                    <Typography variant="h6" component="div" fontWeight={"bolder"} sx={{ flexGrow: 1 }}>
                        <Link component={ReactRouterLink} to="/" color="inherit" underline="hover">
                            {smallScreen ? 'NB' : '很厉害的博客'}
                        </Link>
                    </Typography>
                    {showSearchBar &&
                        <ArticleSearchBar />
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;