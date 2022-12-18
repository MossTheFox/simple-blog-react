import { Box, Checkbox, Grid, Link, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ImageUploadButton from "../../ui/forms/ImageUploadButton";
import { markdownGetReactDOMs } from "../../utils/markdownTools";

function MarkdownEditor({ initialValue, updateCallback }: {
    updateCallback?: (md: string) => void;
    initialValue?: string;
    autoSave?: boolean;
}) {

    const [md, setMd] = useState(initialValue ?? '');

    const [enableRealtimePreview, setEnableRealtimePreview] = useState(false);

    useEffect(() => {
        if (updateCallback) {
            updateCallback(md);
        }
    }, [md, updateCallback]);

    return <Grid container spacing={2}>
        <Grid item xs={12} sm={enableRealtimePreview ? 6 : 12}>
            <Box display='flex' justifyContent='space-between'>
                <Box>
                    <Typography variant="body2" fontWeight="bolder" gutterBottom>
                        Markdown <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.markdownguide.org/cheat-sheet/"
                            underline="hover"
                        >语法帮助</Link>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        若要使用标题格式，建议从 三级标题 开始。
                    </Typography>
                </Box>
                {!enableRealtimePreview &&
                    <Box pb={1}>
                        <Typography variant="body2" fontWeight="bolder" display="inline-block">实时预览
                        </Typography>
                        <Checkbox size="small" checked={enableRealtimePreview} onChange={(e, c) => setEnableRealtimePreview(c)} />
                    </Box>
                }
            </Box>
            <Box py={1}>
                <ImageUploadButton children="插入图片" />
            </Box>
        </Grid>

        <Grid item xs={12} sm={enableRealtimePreview ? 6 : 0} hidden={!enableRealtimePreview}>
            {enableRealtimePreview &&
                <Box pb={1}>
                    <Typography variant="body2" fontWeight="bolder" display="inline-block">实时预览
                    </Typography>
                    <Checkbox size="small" checked={enableRealtimePreview} onChange={(e, c) => setEnableRealtimePreview(c)} />
                </Box>
            }

        </Grid>

        <Grid item xs={12} sm={enableRealtimePreview ? 6 : 12}>
            <Box height={'calc(100vh - 10rem)'} overflow="auto"
                border={1} borderColor="divider" borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            >
                <TextField
                    size="small"
                    fullWidth
                    multiline
                    minRows={20}
                    autoComplete="off"
                    value={md}
                    onChange={(e) => setMd(e.target.value)}
                />

            </Box>
        </Grid>

        {enableRealtimePreview &&
            <Grid item xs={12} sm={enableRealtimePreview ? 6 : 0}>
                <Box height={'calc(100vh - 10rem)'} overflow="auto"
                    border={1} borderColor="divider" borderRadius={(theme) => `${theme.shape.borderRadius}px`}
                >
                    <Box p={2}>
                        {markdownGetReactDOMs(md)}
                    </Box>

                </Box>
            </Grid>
        }
    </Grid >
}

export default MarkdownEditor;