import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, Theme, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TemplateLoadingPlaceHolder, TemplateOnErrorRender } from "../../hooks/AsyncLoadingHandler";
import useAsync from "../../hooks/useAsync";
import { MarkdownAutosaveDocument, MarkdownLocalCacheHandler } from "../../scripts/localDB";

function MarkdownAutosaveDrawer({
    open,
    setOpen,
    onReplaceCallback
}: {
    open: boolean,
    setOpen: (bool: boolean) => void,
    onReplaceCallback: (md: string) => void
}) {

    const bigScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const [data, setData] = useState<MarkdownAutosaveDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<Error | null>(null);
    const asyncFetchData = useCallback(async () => {
        return await MarkdownLocalCacheHandler.getMarkdownAutosavedRecords();
    }, []);
    const onSuccess = useCallback((data: MarkdownAutosaveDocument[]) => {
        setData(data);
        setLoading(false);
        setErr(null);
    }, []);

    const onError = useCallback((e: Error) => {
        setLoading(false);
        setErr(e);
    }, []);

    const fireOnce = useAsync(asyncFetchData, onSuccess, onError);

    const handleFetch = useCallback(() => {
        setLoading(true);
        setErr(null);
        fireOnce();
    }, [])

    useEffect(() => {
        if (open) {
            handleFetch();
        }
    }, [open]);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = useCallback((index: number) => {
        setSelectedIndex(index);
        setDialogOpen(true);
    }, []);

    const handleAppend = useCallback(() => {
        onReplaceCallback(data[selectedIndex].data);
        setOpen(false);
        setDialogOpen(false);
    }, [data, selectedIndex, onReplaceCallback]);

    return <SwipeableDrawer
        anchor={bigScreen ? 'left' : 'bottom'}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
    >
        <Box>
            <List>
                <ListItem>
                    <Typography variant="h6" fontWeight='bolder'>
                        自动保存历史
                    </Typography>
                </ListItem>

                {loading && <TemplateLoadingPlaceHolder />}

                {!loading && !err && (
                    data.map((v, i) => (
                        <ListItemButton key={i}
                            onClick={handleDialogOpen.bind(null, i)}
                        >
                            {`${new Date(v.unixTime).toLocaleString()}: ${v.data.length > 25 ? (
                                v.data.substring(0, 20) + '...') : v.data}`}
                        </ListItemButton>
                    ))
                )}
            </List>
            {err &&
                <Box p={1}>
                    <TemplateOnErrorRender />
                </Box>
            }
        </Box>

        <Dialog fullWidth maxWidth="sm" open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle fontWeight='bolder'>
                恢复自动保存历史
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>以下是此记录的内容。要恢复到此状态吗？</Typography>
                <Typography variant="body2" whiteSpace='pre-wrap' color="textSecondary"
                    children={data[selectedIndex]?.data || '读取出错。'} />
            </DialogContent>
            <DialogActions>
                <Button variant="text" children='取消' onClick={() => setDialogOpen(false)} />
                <Button variant="text" children='确定' onClick={() => handleAppend()} />
            </DialogActions>
        </Dialog>

    </SwipeableDrawer>

}

export default MarkdownAutosaveDrawer;