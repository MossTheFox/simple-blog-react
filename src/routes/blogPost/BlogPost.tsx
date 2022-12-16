import { Box } from "@mui/material";
import { useCallback } from "react";
import { useParams } from 'react-router-dom';
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { markdownGetReactDOMs } from "../../utils/markdownTools";
import { blogTestPostData } from "../../_testData";


function BlogPostRender({ data }: { data: BlogPostData }) {

    return <>{markdownGetReactDOMs(data.content)}</>;
}

function BlogPost() {

    const { id } = useParams();

    const asyncGetBlogPostData = useCallback(() => {
        // um
        return new Promise<BlogPostData>((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.2 ? resolve(blogTestPostData) : reject(new Error('测试错误'));
            }, 1000)
        });
    }, []);

    return <Box px={2} py={1}>
        <AsyncLoadingHandler asyncFunc={asyncGetBlogPostData} OnSuccessRender={BlogPostRender} />
    </Box>
}

export default BlogPost;