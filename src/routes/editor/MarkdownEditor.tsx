import { Box, Checkbox, Grid, Link, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageUploadButton from "../../ui/forms/ImageUploadButton";
import { markdownGetReactDOMs } from "../../utils/markdownTools";

function MarkdownEditor({ initialValue, updateCallback }: {
    updateCallback?: (md: string) => void;
    initialValue?: string;
    autoSave?: boolean;
}) {

    const [md, setMd] = useState(initialValue ?? '');

    const [enableRealtimePreview, setEnableRealtimePreview] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (updateCallback) {
            updateCallback(md);
        }
    }, [md, updateCallback]);

    const urlCallback = useCallback((url: string) => {
        let select = inputRef.current?.selectionStart;
        setMd((prev) => {
            if (typeof select !== 'number') {
                return (
                    prev + '\n\n'
                    + `![image](${url})`
                );
            }
            const imageTag = `![image](${url})`;
            if (inputRef.current && inputRef.current.selectionStart !== null && inputRef.current.selectionEnd !== null) {
                inputRef.current.selectionStart += imageTag.length;
                inputRef.current.selectionEnd = inputRef.current.selectionStart;
            }
            return prev.substring(0, select) + imageTag + prev.substring(select);
            
        }
        )
    }, [inputRef]);

    const tabInsertHandler = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!inputRef.current) return;
        if (e.ctrlKey) return;
        if (inputRef.current.selectionStart === null || inputRef.current.selectionEnd === null) return;
        if (e.key === 'Tab') {
            e.preventDefault();

            if (e.shiftKey) {
                /** 向前缩进 */
                let select = inputRef.current.selectionStart;
                let end = inputRef.current.selectionEnd;
                let text = inputRef.current.value;
                let check = text.substring(0, select).lastIndexOf('    ');
                if (check === select - 4) {
                    setMd(`${text.substring(0, select - 4)}${text.substring(select)}`);
                    /** 不优雅，目前没找到更合理的实现方式。 */
                    setTimeout(() => {
                        if (inputRef.current) {
                            inputRef.current.selectionStart = select - 4;
                            inputRef.current.selectionEnd = end - 4;
                        }
                    }, 0);
                    return;
                }
                let lines = text.split('\n');
                let currentLine = text.substring(0, select).split('\n').length - 1;
                if (lines[currentLine].startsWith('    ')) {
                    lines[currentLine] = lines[currentLine].substring(4);
                }
                setMd(lines.join('\n'));
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.selectionStart = select - 4;
                        inputRef.current.selectionEnd = end - 4;
                    }
                }, 0);
                return;
            } else {
                /** 向后 >> */
                let select = inputRef.current.selectionStart;
                let end = inputRef.current.selectionEnd;
                let text = inputRef.current.value;
                setMd(`${text.substring(0, select)}    ${text.substring(select)}`);
                /** 不优雅，目前没找到更合理的实现方式。 */
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.selectionStart = select + 4;
                        inputRef.current.selectionEnd = end + 4;
                    }
                }, 0);
            }
        }
    }, [inputRef]);

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
                <ImageUploadButton children="插入图片" urlCallback={urlCallback} />
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
                    inputRef={inputRef}
                    onChange={(e) => setMd(e.target.value)}
                    onKeyDown={tabInsertHandler}
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