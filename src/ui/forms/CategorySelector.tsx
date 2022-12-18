import { Box, MenuItem, Select, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncLoadingHandler from "../../hooks/AsyncLoadingHandler";
import { APIService } from "../../scripts/dataAPIInterface";

export const createNewCategoryKey = '- 新增 -' as const;

function CategorySelector({
    initialData = createNewCategoryKey,
    setSelected,
}: {
    setSelected: (str: string) => void,
    initialData?: string
}) {


    return <AsyncLoadingHandler asyncFunc={APIService.getBlogCategoryList}
        OnSuccessRender={({ data }) => {
            const [categoryList, setCategoryList] = useState<CategoryListData>(() => data);

            // init list
            const [dropdownSelected, setDropdownSelected] = useState<string>(() => {
                if (data.map((v) => v.name).includes(initialData)) {
                    return initialData;
                }
                return createNewCategoryKey;
            });

            // on dropdown menu change
            const updateDropdownSelected = useCallback((v: string) => {
                setDropdownSelected(v);
                setSelected(v);
            }, [setSelected]);

            // 
            const updateInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                setSelected(e.target.value);
            }, []);

            return <Stack spacing={1}>
                <Select fullWidth size="small" onChange={(e) => updateDropdownSelected(e.target.value + '')}
                    value={dropdownSelected}
                >
                    <MenuItem value={createNewCategoryKey}>{createNewCategoryKey}</MenuItem>
                    {categoryList.map((v, i) => (
                        <MenuItem value={v.name} key={i}>{`${v.name}`}{v.postsCount > 0 ? ` (${v.postsCount})` : ''}</MenuItem>
                    ))}
                </Select>

                
            </Stack>
        }}
    />
}

export default CategorySelector;