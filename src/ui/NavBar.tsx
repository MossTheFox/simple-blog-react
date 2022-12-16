import { GitHub } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Container, IconButton } from "@mui/material";

function NavBar() {

    return (
        <AppBar position="sticky" color="transparent">
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography variant="h6" component="div" fontWeight={"bolder"} sx={{ flexGrow: 1 }}>
                        Placeholder
                    </Typography>
                    <IconButton size="large" color="inherit"
                        children={<GitHub />}
                        href="https://github.com/MossTheFox/"
                        target="_blank"
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;