import { Box, MenuItem, Select, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { APIService } from "../../scripts/dataAPIInterface";

export const createNewCategoryKey = '- 新增 -' as const;

function CategorySelector({
    onSelectedChange
}: {
    onSelectedChange?: (str: string) => void
}) {
    const [selected, setSelected] = useState<string>(createNewCategoryKey);

    useEffect(() => {
        if (onSelectedChange && selected !== createNewCategoryKey) {
            onSelectedChange(selected);
        }
    }, [selected, onSelectedChange]);

    const [categoryList, setCategoryList] = useState<CategoryListData>([{ name: createNewCategoryKey, postsCount: 0 }]);

    return <AsyncLoadingHandler asyncFunc={APIService.getBlogCategoryList}
        OnSuccessRender={({ data }) => {
            useEffect(() => {
                setCategoryList(data);
            }, [data, setCategoryList]);

            const [customCategory, setCustomCategory] = useState('');

            const updateInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomCategory(e.target.value);
                if (onSelectedChange) {
                    onSelectedChange(e.target.value);
                }
            }, [onSelectedChange]);

            return <Stack spacing={1}>
                <Select fullWidth size="small" onChange={(e) => setSelected(e.target.value + '')}
                    value={selected}
                >
                    <MenuItem value={createNewCategoryKey}>{createNewCategoryKey}</MenuItem>
                    {categoryList.map((v, i) => (
                        <MenuItem value={v.name} key={i}>{`${v.name}`}{v.postsCount > 0 ? ` (${v.postsCount})` : ''}</MenuItem>
                    ))}
                </Select>
                {selected === createNewCategoryKey && (
                    <Box>
                        <TextField variant="standard" size="small" label="分类名称" fullWidth
                            value={customCategory}
                            onChange={updateInput}
                        />
                    </Box>
                )}
            </Stack>
        }}
    />
}

export default CategorySelector;