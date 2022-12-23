import { Box, Button, Checkbox, Grid, Link, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarkdownLocalCacheHandler } from "../../scripts/localDB";
import ClipboardImageHandler from "../../ui/forms/ClipboardImageHandler";
import ImageUploadButton from "../../ui/forms/ImageUploadButton";
import { markdownGetReactDOMs } from "../../utils/markdownTools";
import MarkdownAutosaveDrawer from "./MarkdownAutosaveDrawer";
import MarkdownEditorHelpDialog from "./MarkdownEditorHelpDialog";

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

    // 自动保存
    const [autoSaveDrawerOpen, setAutoSaveDrawerOpen] = useState(false);
    const appendRecord = useCallback((str: string) => {
        setMd(str);
        setAutoSaveDrawerOpen(false);
    }, []);

    useEffect(() => {
        let interval = setInterval(async () => {
            if (inputRef.current && inputRef.current.value.trim().length > 10) {
                try {
                    await MarkdownLocalCacheHandler.pushMarkdownCache(inputRef.current.value);
                } catch (err) {
                    import.meta.env.DEV && console.log(err);
                }
            }
        }, 15 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, [inputRef])

    // 帮助对话框
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const openHelp = useCallback(() => setHelpDialogOpen(true), []);

    // 粘贴图片

    const [clipboardImage, setClipboardImage] = useState<File | null>(null);
    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        if (e.clipboardData.files.length) {
            // handle...
            e.preventDefault();
            const file = e.clipboardData.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            // 准备图片上传
            setClipboardImage(file);
        }
    }, []);


    return <Grid container spacing={2}>
        <Grid item xs={12} sm={enableRealtimePreview ? 6 : 12}>
            <Box display='flex' justifyContent='space-between'>
                <Box display='flex' justifyContent="start" gap={1} flexWrap='wrap' alignItems="baseline" mb={1}>
                    <Typography variant="body2" fontWeight="bolder" gutterBottom>
                        Markdown
                        {/* <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.markdownguide.org/cheat-sheet/"
                            underline="hover"
                        >语法帮助</Link> */}
                    </Typography>
                    <Link component="button" fontWeight='bolder' display="inline-block"
                        onClick={openHelp}
                        variant="body2" color="primary" underline="hover" gutterBottom>
                        支持的语法列表
                    </Link>
                </Box>
                <MarkdownEditorHelpDialog open={helpDialogOpen} setOpen={setHelpDialogOpen} />
                {!enableRealtimePreview &&
                    <Box pb={1}>
                        <Typography variant="body2" fontWeight="bolder" display="inline-block">实时预览
                        </Typography>
                        <Checkbox size="small" checked={enableRealtimePreview} onChange={(e, c) => setEnableRealtimePreview(c)} />
                    </Box>
                }
            </Box>
            <Box py={1} display="flex" justifyContent='space-between'>
                <ImageUploadButton children="插入图片" urlCallback={urlCallback} />
                <Button variant='text' onClick={() => setAutoSaveDrawerOpen(true)} children='查看自动保存历史' />
            </Box>
            <MarkdownAutosaveDrawer open={autoSaveDrawerOpen} setOpen={setAutoSaveDrawerOpen} onReplaceCallback={appendRecord} />
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
                position="relative"
            >
                <ClipboardImageHandler urlCallback={urlCallback} file={clipboardImage} setFile={setClipboardImage} />
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
                    onPaste={handlePaste}
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