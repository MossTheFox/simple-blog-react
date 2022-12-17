import { Box, Button, Chip, Grid, InputBase, MenuItem, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { APIService } from "../../scripts/dataAPIInterface";

function TagSelector({
    onSelectedChange
}: {
    onSelectedChange?: (selected: string[]) => void
}) {
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (onSelectedChange) {
            onSelectedChange(selected);
        }
    }, [selected, onSelectedChange]);

    const insertNew = useCallback((newTag: string) => {
        setSelected((prev) => {
            let set = new Set<string>([...prev, newTag]);
            return Array.from(set);
        })
    }, []);

    const deleteOne = useCallback((tag: string | number) => {
        setSelected((prev) => {
            let index = typeof tag === 'number' ? tag : (prev.findIndex((v) => v === tag));
            if (index === -1) return [...prev];
            let newArray = [...prev];
            newArray.splice(index, 1);
            return newArray;
        })
    }, []);

    const [tagList, setTagList] = useState<TagListData>([]);

    return <AsyncLoadingHandler asyncFunc={APIService.getBlogTagList}
        OnSuccessRender={({ data }) => {
            useEffect(() => {
                setTagList(data);
            }, [data, setTagList]);

            const [customInput, setCustomInput] = useState('');

            const handleSubmit = useCallback(() => {
                if (customInput.length === 0) return;
                insertNew(customInput);
                setCustomInput('');
            }, [customInput]);

            const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                let newValue = e.target.value;
                newValue = newValue.split(',').join('');
                setCustomInput(newValue);
            }, []);

            return <Grid container>
                <Grid item xs={6}>
                    <Box display="flex" flexWrap={'wrap'} gap={1}>
                        {selected.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">在右栏添加标签...</Typography>
                        ) : (
                            selected.map((v, i) => (
                                <Chip key={i}
                                    label={v}
                                    color="primary"
                                    onDelete={deleteOne.bind(null, i)}
                                />
                            ))
                        )}
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" flexWrap={'wrap'} gap={1} mb={1}>
                        {tagList.map((v, i) => (
                            <Chip key={i}
                                label={`${v.name} (${v.postsCount})`}
                                color="default"
                                onClick={insertNew.bind(null, v.name)}
                            />
                        ))}
                    </Box>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Box display="flex" borderBottom={1} borderColor='divider'>

                            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="自定义..." autoComplete="off"
                                value={customInput}
                                onChange={handleInputChange}
                            />
                            <Button variant="text" size="small"
                                onClick={handleSubmit}
                                disabled={!customInput.length}
                            >添加</Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        }}
    />
}

export default TagSelector;