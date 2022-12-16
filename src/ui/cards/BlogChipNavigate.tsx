import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NavigateChipUnit({ record }: { record: TagRecord }) {
    const navigate = useNavigate();

    return <Chip
        color="primary"
        variant="outlined"
        label={`${record.name} (${record.postsCount})`}
        onClick={() => navigate(`/tag/${encodeURI(record.name)}`)}
    />
}

function BlogChipNavigate({ tagList }: {
    tagList: TagListData
}) {
    return <Box display='flex' flexWrap='wrap'>

        {tagList.map((v, i) => <Box p={0.5} key={i}>
            <NavigateChipUnit record={v} />
        </Box>)}
    </Box>
}

export default BlogChipNavigate;