import { Divider, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { marked } from 'marked';

export function markdownGetParsedTokens(md: string) {
    return marked.lexer(md);
}

// debug only
// @ts-ignore
window.__MARKED = (str: string) => console.log(markdownGetParsedTokens(str));

// 层级结构示例
const example = [
    {
        "type": "paragraph",
        "raw": "测试[aa**加粗**bb](http://aaa.cc)内联\nwhat",
        "text": "测试[aa**加粗**bb](http://aaa.cc)内联\nwhat",
        "tokens": [
            {
                "type": "text",
                "raw": "测试",
                "text": "测试"
            },
            {
                "type": "link",
                "raw": "[aa**加粗**bb](http://aaa.cc)",
                "href": "http://aaa.cc",
                "title": null,
                "text": "aa**加粗**bb",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "aa",
                        "text": "aa"
                    },
                    {
                        "type": "strong",
                        "raw": "**加粗**",
                        "text": "加粗",
                        "tokens": [
                            {
                                "type": "text",
                                "raw": "加粗",
                                "text": "加粗"
                            }
                        ]
                    },
                    {
                        "type": "text",
                        "raw": "bb",
                        "text": "bb"
                    }
                ]
            },
            {
                "type": "text",
                "raw": "内联\nwhat",
                "text": "内联\nwhat"
            }
        ]
    }
] as const;

// 表格结构示例
const tableExample = [
    {
        "type": "table",
        "header": [
            {
                "text": "Tables",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "Tables",
                        "text": "Tables"
                    }
                ]
            },
            {
                "text": "Are",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "Are",
                        "text": "Are"
                    }
                ]
            },
            {
                "text": "Cool",
                "tokens": [
                    {
                        "type": "text",
                        "raw": "Cool",
                        "text": "Cool"
                    }
                ]
            }
        ],
        "align": [
            null,
            "center",
            "right"
        ],
        "rows": [
            [
                {
                    "text": "**col 3 is**",
                    "tokens": [
                        {
                            "type": "strong",
                            "raw": "**col 3 is**",
                            "text": "col 3 is",
                            "tokens": [
                                {
                                    "type": "text",
                                    "raw": "col 3 is",
                                    "text": "col 3 is"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "right-aligned",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "right-aligned",
                            "text": "right-aligned"
                        }
                    ]
                },
                {
                    "text": "$1600",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "$1600",
                            "text": "$1600"
                        }
                    ]
                }
            ],
            [
                {
                    "text": "col 2 is",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "col 2 is",
                            "text": "col 2 is"
                        }
                    ]
                },
                {
                    "text": "*centered*",
                    "tokens": [
                        {
                            "type": "em",
                            "raw": "*centered*",
                            "text": "centered",
                            "tokens": [
                                {
                                    "type": "text",
                                    "raw": "centered",
                                    "text": "centered"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "$12",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "$12",
                            "text": "$12"
                        }
                    ]
                }
            ],
            [
                {
                    "text": "zebra stripes",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "zebra stripes",
                            "text": "zebra stripes"
                        }
                    ]
                },
                {
                    "text": "~~are neat~~",
                    "tokens": [
                        {
                            "type": "del",
                            "raw": "~~are neat~~",
                            "text": "are neat",
                            "tokens": [
                                {
                                    "type": "text",
                                    "raw": "are neat",
                                    "text": "are neat"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "$1",
                    "tokens": [
                        {
                            "type": "text",
                            "raw": "$1",
                            "text": "$1"
                        }
                    ]
                }
            ]
        ],
        "raw": "| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| **col 3 is**  | right-aligned | $1600 |\n| col 2 is      | *centered*    |   $12 |\n| zebra stripes | ~~are neat~~  |    $1 |"
    }
] as const;

export function markdownGetReactDOMs(md: string | marked.Token[]): JSX.Element | undefined {
    if (!md) return;
    const tokens = typeof md === 'string' ? markdownGetParsedTokens(md) : md;
    return <>
        {tokens.map((v, i) => {
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
                    return `${v.text}`;
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
                    return `${v.raw}`;
                case 'image':
                    // TODO: 图片框组件...
                    return <img key={i} src={v.href} alt={v.text} />
                case 'link':
                    return <Link key={i} href={v.href} target="_blank" underline='hover'>{children}</Link>;
                case 'list':
                    if (v.ordered) {
                        return <ol key={i}>{markdownGetReactDOMs(v.items)}</ol>;
                    } else {
                        return <ul key={i}>{markdownGetReactDOMs(v.items)}</ul>;
                    }
                case 'list_item':
                    console.log(v);
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
                            return children;
                        }
                    }
                    // React 会做好转义。如果是 v.text, 会造成多一次 HTML 字符转义 (显示例如 ' -> &#39;)
                    return v.raw;
            }
        })}
    </>;
}