import { Box, Typography } from "@mui/material";

function MainBanner() {
    return <Box sx={{ backgroundColor: (theme) => theme.palette.primary.light }}
        py={8}
        color={(theme) => theme.palette.primary.contrastText}
    >
        <Typography variant="h3" fontWeight="bolder"
            textAlign="center"
        >NB BLOG</Typography>
    </Box>
}

export default MainBanner;