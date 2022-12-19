import { Avatar, Box } from "@mui/material";


function UserProfileAvatar({
    src = '',
    username = ''
}) {

    return <Box p={2} width='100%'
        sx={{
            position: "relative",
        }}
    >
        <Box width="100%" position="relative" mb={2}
            sx={{
                '::after': {
                    content: `""`,
                    display: 'block',
                    pb: '100%'
                }
            }}
        >
            <Avatar alt={`${username} avatar`}
                src={src}
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    objectFit: 'cover'
                }}
            />
        </Box>


    </Box>
}

export default UserProfileAvatar;