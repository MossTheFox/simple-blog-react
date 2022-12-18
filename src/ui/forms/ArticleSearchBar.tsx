import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArticleSearchBar() {

    const navigate = useNavigate();

    const [input, setInput] = useState('');

    const handleSubmit = useCallback(() => {
        if (input.length === 0) return;
        navigate(`/search/${encodeURI(input.trim())}`);
        setInput('');
    }, [input, navigate]);

    return <Paper>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Box px={2} py={1} display="flex" justifyContent='center' alignItems="center" gap={1}>
                <InputBase sx={{ color: 'inherit' }}
                    placeholder="搜索文章……"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <IconButton size="small" onClick={handleSubmit} disabled={input.length === 0}>
                    <Search />
                </IconButton>
            </Box>
        </form>
    </Paper>
}

export default ArticleSearchBar;