import { GitHub } from "@mui/icons-material";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";


function Footer() {
    return <Container maxWidth={false} sx={{
        py: 2
    }}>
        <Stack spacing={1}
            alignItems="center"
            textAlign="center"
        >
            <Stack spacing={0.5} pb={1} direction="row" alignItems="center">
                <IconButton target="_blank" href="https://github.com/MossTheFox/"><GitHub /></IconButton>
            </Stack>
            <Box pb={1}>
                <Typography variant="body2" color="textSecondary">
                    NB Blog Demo | 2022
                </Typography>
            </Box>
        </Stack>
    </Container>
}

export default Footer;