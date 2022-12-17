import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { APIService } from "../../scripts/dataAPIInterface";
import { markdownGetReactDOMs } from "../../utils/markdownTools";

function BlogPostRender({ data }: { data: BlogPostData }) {
    return <>{markdownGetReactDOMs(data.content)}</>;
}

function BlogPost() {

    const { id } = useParams();
    const navigate = useNavigate();

    const goBackOrgoHome = useCallback(() => {
        if (history.length > 1) {
            history.back();
            return;
        }
        navigate('/');
    }, []);

    const asyncGetBlogPostData = useCallback(async () => {
        // um
        if (!id || (Number.isNaN(+id))) throw new Error('无效的文章 ID。');
        return await APIService.getBlogFullDataById(id);
    }, [id]);

    return <Box>
        <Box pb={2}>
            <Button onClick={goBackOrgoHome} variant="outlined" startIcon={<ArrowBack />} children={'返回上一页'} />
        </Box>

        <AsyncLoadingHandler asyncFunc={asyncGetBlogPostData} OnSuccessRender={BlogPostRender} />
    </Box>
}

export default BlogPost;