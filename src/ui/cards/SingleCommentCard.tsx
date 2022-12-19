import { Avatar, Card, CardContent, CardHeader, Typography } from "@mui/material";

function SingleCommentCard({ comment, replyToTarget }: {
    comment: BlogComment;
    replyToTarget?: BlogComment;
}) {
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
    </Card>
}

export default SingleCommentCard;