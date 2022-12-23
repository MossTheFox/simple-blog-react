import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import { useCallback } from "react";

function MarkdownEditorHelpDialog({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (open: boolean) => void
}) {
    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle fontWeight='bolder'>Markdown 格式支持</DialogTitle>
        <DialogContent>
            <DialogContentText gutterBottom>由于 Markdown 存在一些非标准的特殊格式，这里提供一组当前编辑器支持的语法格式列表。</DialogContentText>
            <DialogContentText fontWeight='bolder' gutterBottom>
                请注意：为了保证页面安全性和避免注入攻击，HTML 内容将被阻止。支持的标签仅有 <code>{`<br>`}</code> (换行)。
            </DialogContentText>

            <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>正文格式</DialogContentText>
            <DialogContentText gutterBottom>
                新增段落：保留一个空行以创建一个新的段落；
            </DialogContentText>
            <DialogContentText gutterBottom>
                <strong>粗体</strong>：<code>**要加粗的内容**</code>
            </DialogContentText><DialogContentText gutterBottom>
                <em>斜体</em>：<code>*Italic*</code>
            </DialogContentText>
            <DialogContentText gutterBottom>
                <del>删除线</del>：<code>~del~</code>
            </DialogContentText>
            <DialogContentText gutterBottom>
                转义字符 (<code>\</code>)：<code>\~wow\~</code>
            </DialogContentText>
            <DialogContentText gutterBottom>
                {'> 引用：'}：<code>{'> 引用的段落'}</code>
            </DialogContentText><DialogContentText gutterBottom>
                行内代码：<code>`code`</code>
            </DialogContentText><DialogContentText gutterBottom>
                链接：<code>[链接文字](https://example.com/)</code>
            </DialogContentText><DialogContentText gutterBottom>
                图片：<code>![注释文字](https://example.com/example.png)</code>
            </DialogContentText>
            <DialogContentText gutterBottom>
                分隔线：<code>---</code>
            </DialogContentText>

            <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>标题格式</DialogContentText>
            <DialogContentText gutterBottom>
                一级至六级标题：以对应数量的 <code>#</code> 开头，并保留一个空格于其后。
            </DialogContentText>
            <DialogContentText gutterBottom>
                紧邻一行分割线的文字，也会被视为标题格式。
            </DialogContentText>

            <DialogContentText variant="h6" fontWeight='bolder' gutterBottom>表格</DialogContentText>
            <pre style={{ margin: '.5em auto' }}>
                <code>{`| 左对齐 | 居中对齐 | 右对齐 |
| :---- | :----: | ----: |
| 表格内容 | 表格内容 | 表格内容 |
| 表格内容 | 表格内容 | 表格内容 |
`}</code>
            </pre>

            <DialogContentText variant="h6" fontWeight='bolder'>代码块</DialogContentText>
            <DialogContentText gutterBottom>(不支持语法高亮)</DialogContentText>
            <code>{`\`\`\`
console.log('Hi!');
\`\`\``}</code>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>关闭</Button>
        </DialogActions>
    </Dialog>
}

export default MarkdownEditorHelpDialog;