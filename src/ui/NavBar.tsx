import { GitHub } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Container, IconButton, Link } from "@mui/material";
import { Link as ReactRouterLink } from 'react-router-dom';


function NavBar() {

    return (
        <AppBar position="sticky" color="primary">
            <Container maxWidth="lg">
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