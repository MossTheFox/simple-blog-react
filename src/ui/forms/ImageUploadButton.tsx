import { InsertPhoto } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { useMemo } from "react";

function ImageUploadButton(props: {
    urlCallback?: (url: string) => void,
} & ButtonProps) {
    const urlCallback = useMemo(() => props.urlCallback, [props.urlCallback]);

    return <>
        <Button children="上传图片" variant="contained" startIcon={<InsertPhoto />} {...props} 
            disabled    // TODO
        />
    </>
}

export default ImageUploadButton;