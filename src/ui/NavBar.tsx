import { GitHub } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Container, IconButton, Link, Breakpoint } from "@mui/material";
import { Link as ReactRouterLink } from 'react-router-dom';


function NavBar({ maxWidth = 'lg', position = "sticky" }: { maxWidth?: Breakpoint, position?: "fixed" | "sticky" | "absolute" | "relative" | "static" | undefined }) {

    return (
        <AppBar position={position} color="primary">
            <Container maxWidth={maxWidth}>
                <Toolbar>
                    <Typography variant="h6" component="div" fontWeight={"bolder"} sx={{ flexGrow: 1 }}>
                        <Link component={ReactRouterLink} to="/" color="inherit" underline="hover">
                            很厉害的博客
                        </Link>
                    </Typography>
                    <IconButton size="large" color="inherit"
                        children={<GitHub />}
                        href="https://github.com/MossTheFox/simple-blog-react"
                        target="_blank"
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;