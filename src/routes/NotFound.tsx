import { Box, Container, Link, Paper, Typography } from "@mui/material";
import { Link as ReactRouterLink } from 'react-router-dom';

function NotFound() {
    return <Container maxWidth="md">
        <Box py={10}>
            <Paper>
                <Box px={2} py={4}>
                    <Typography
                        textAlign="center"
                        variant="h5" fontWeight="bolder" gutterBottom>
                        Not Found
                    </Typography>
                    <Typography textAlign="center">
                        你可以<Link component={ReactRouterLink} to="/"
                            underline="hover"
                        >点击这里来返回首页</Link>。
                    </Typography>
                </Box>
            </Paper>
        </Box>
    </Container>
}

export default NotFound;