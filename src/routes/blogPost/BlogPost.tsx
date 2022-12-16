import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { markdownGetReactDOMs } from "../../utils/markdownTools";
import { blogTestPostData } from "../../_testData";


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

    const asyncGetBlogPostData = useCallback(() => {
        // um
        return new Promise<BlogPostData>((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.2 ? resolve(blogTestPostData) : reject(new Error('模拟加载错误'));
            }, 1000)
        });
    }, []);

    return <Box>
        <Box pb={2}>
            <Button onClick={goBackOrgoHome} variant="outlined" startIcon={<ArrowBack />} children={'返回上一页'} />
        </Box>

        <AsyncLoadingHandler asyncFunc={asyncGetBlogPostData} OnSuccessRender={BlogPostRender} />
    </Box>
}

export default BlogPost;