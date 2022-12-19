import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Edit } from "@mui/icons-material";

import { blogUserContext } from "../../context/userContext";
import { PLACEHOLDER_AVATAR_URL } from "../../constants";
import { APIService } from "../../scripts/dataAPIInterface";

function BigAvatar({
    showEditButton = true,
}) {
    const { user } = useContext(blogUserContext);

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const setOpenCallback = useCallback((bool: boolean) => {
        setEditDialogOpen(bool);
    }, []);

    return <Box p={2} width='100%'
        sx={{
            position: "relative",
        }}
    >
        {typeof user === 'object' && (<>

            <Box width="100%" mb={2}>
                <Avatar alt={`${user.username} avatar`} src={user.avatar === PLACEHOLDER_AVATAR_URL ? PLACEHOLDER_AVATAR_URL : APIService.parseResourceUrl(user.avatar)}
                    sx={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </Box>
            {showEditButton && <>
                <Tooltip title="修改头像" arrow
                    enterTouchDelay={0}
                >
                    <IconButton
                        aria-label="修改头像"
                        size="medium"
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: "100%",
                            transform: "translate(-100%, -100%)",
                        }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
                {/* <AvatarUpdateDialog
                    isOpen={editDialogOpen}
                    setOpen={setOpenCallback}
                /> */}
            </>
            }
        </>
        )}
    </Box>
}

export default BigAvatar;