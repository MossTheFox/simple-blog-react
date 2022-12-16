import { Divider, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { marked } from 'marked';

export function markdownGetParsedTokens(md: string) {
    return marked.lexer(md);
}

// debug only
// @ts-ignore
import.meta.env.DEV && (window.__MARKED = (str: string) => console.log(markdownGetParsedTokens(str)));

export function markdownGetReactDOMs(md: string | marked.Token[]): (JSX.Element | undefined)[] | undefined {
    if (!md) return;
    const tokens = typeof md === 'string' ? markdownGetParsedTokens(md) : md;
    return tokens.map((v, i) => {
        const children = (('tokens' in v && Array.isArray(v.tokens)) ? markdownGetReactDOMs(v.tokens) : undefined);
        switch (v.type) {
            case 'blockquote':
                // 引用
                return <Typography key={i}
                    variant="body1"
                    color="textSecondary"
                    pl={4}
                    gutterBottom
                >{v.text}</Typography>;
            case 'br':
                // 额外的换行
                return <br key={i} />;
            case 'code':
                // 代码块
                switch (v.codeBlockStyle) {
                    case 'indented':
                        return <pre key={i}>
                            <code>{v.text}</code>
                        </pre>;
                    default:
                        // 触发条件未知 (得看 marked 源码)
                        return <code key={i}>{v.text}</code>;
                }
            case 'codespan':
                return <code key={i}>{v.text}</code>;
            case 'del':
                return <del key={i}>{children}</del>;
            case 'def':
                // 这是啥
                console.log(`Unsupported type: def, `, v);
                return;
            case 'em':
                // 斜体，按照标准来的话不用 <i> 而是 <em>
                return <em key={i}>{children}</em>;
            case 'escape':
                // 把转义后的文字拿出来即可
                return <span key={i}>{`${v.text}`}</span>;
            case 'heading':
                // 大标题
                const level = v.depth;  // 1 ~ 6
                const depthVariant = ['body1', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
                return <Typography key={i}
                    variant={depthVariant[level]}
                    fontWeight="bolder"
                    gutterBottom>{children}</Typography>;
            case 'hr':
                return <Divider key={i} />;
            case 'html':
                // 拒绝 parse...
                return <span key={i}>`${v.raw}`</span>;
            case 'image':
                // TODO: 图片框组件...
                return <img key={i} src={v.href} alt={v.text} />
            case 'link':
                return <Link key={i} href={v.href} target="_blank" underline='hover'>{children}</Link>;
            case 'list':
                console.log(v);
                if (v.ordered) {
                    return <ol start={v.start || 1} key={i}>{markdownGetReactDOMs(v.items)}</ol>;
                }
                return <ul key={i}>{markdownGetReactDOMs(v.items)}</ul>;
            case 'list_item':
                return <li key={i}>{children}</li>;
            case 'paragraph':
                return <Typography key={i} variant="body1" gutterBottom>{children}</Typography>;
            case 'space':
                // hum, skip
                return;
            case 'strong':
                return <strong key={i}>{children}</strong>;
            case 'table':
                // Markdown table 必须有表头。ref: https://stackoverflow.com/questions/17536216/create-a-table-without-a-header-in-markdown
                return <TableContainer key={i} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {v.header.map((cell, i) =>
                                    <TableCell align='center' key={i}>
                                        {markdownGetReactDOMs(cell.tokens)}
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {v.rows.map((line, i) => <TableRow key={i}>
                                {line.map((cell, i) => <TableCell key={i}
                                    align={v.align[i] || 'inherit'}
                                >
                                    {markdownGetReactDOMs(cell.tokens)}
                                </TableCell>)}
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>;
            case 'text':
                // 这里定义有两类，留意一下。
                if ('tokens' in v) {
                    if (v.tokens) {
                        // 不要用 Empty tag... 纯文本以外的部分需要有 key
                        return <div key={i}>{children}</div>;
                    }
                }
                // React 会做好转义。如果是 v.text, 会造成多一次 HTML 字符转义 (显示例如 ' -> &#39;)
                return <span key={i}>{v.raw}</span>;
        }
    });
}