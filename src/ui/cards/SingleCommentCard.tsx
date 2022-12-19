import { Delete, Reply } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import { useContext } from "react";
import { blogUserContext } from "../../context/userContext";

function SingleCommentCard({ comment, replyToTarget }: {
    comment: BlogComment;
    replyToTarget?: BlogComment;
}) {

    const { user } = useContext(blogUserContext);

    return <Card>
        <CardHeader
            avatar={
                <Avatar src={comment.user.avatar} />
            }
            title={comment.user.username}
            subheader={comment.user.signature}
            sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 1 }}>
            {replyToTarget && (
                <Typography variant="body2" color="textSecondary" gutterBottom
                    children={`回复: ${replyToTarget.user.username}`} />
            )}
            <Typography variant="body1" whiteSpace='pre-wrap'
                children={comment.content} />
        </CardContent>

        <CardActions sx={{
            justifyContent: 'space-between'
        }}>
            <Box>
                {typeof user === 'object' && (
                    user.username === comment.user.username || user.flags.includes('ADMIN')
                ) && (
                        <Button variant="text" startIcon={<Delete />}
                            children="删除" />
                    )}
            </Box>
            <Button variant="text" startIcon={<Reply />} children="回复" />
        </CardActions>
    </Card>
}

export default SingleCommentCard;