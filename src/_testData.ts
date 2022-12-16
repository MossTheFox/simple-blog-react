export const markdownTextTest = `#### Marked - Markdown Parser

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

##### How To Use The Demo

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

##### Why Markdown?

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| **col 3 is**  | right-aligned | $1600 |
| col 2 is      | *centered*    |   $12 |
| zebra stripes | ~~are neat~~  |    $1 |
` as const;

export const blogSummaryTestData: BlogSummaryData = {
    id: 1,
    author: '孙笑川',
    category: '柠檬熟了',
    createdAt: new Date(),
    // lastModified: new Date(),
    summary: '喜报：DOMException\n另一个喜报: TypeError',
    tags: ['祝福', '喜报', '美腻的中国话'],
    title: '孙哥发来核电'
};


export const blogTestPostData: BlogPostData = {
    id: 1,
    author: '孙笑川',
    category: '柠檬熟了',
    createdAt: new Date(),
    lastModified: new Date(),
    summary: '喜报：DOMException\n另一个喜报: TypeError',
    tags: ['祝福', '喜报', '美腻的中国话'],
    title: '今天你🐴炸了，孙哥发来核电',
    allowComment: true,
    content: markdownTextTest
};

export const blogCategoryListTestData: CategoryListData = [
    {
        name: '柠檬熟了',
        postsCount: 114
    },
    {
        name: '你们输了',
        postsCount: 514
    },
    {
        name: '南面湿冷',
        postsCount: 1919
    },
    {
        name: '你买啥了',
        postsCount: 810
    }
];

export const blogTagListTestData: TagListData = [
    {
        name: '祝福',
        postsCount: 114
    },
    {
        name: '喜报',
        postsCount: 514
    },
    {
        name: '美腻的中国话',
        postsCount: 1919
    },
    {
        name: '儒雅',
        postsCount: -1
    },
    {
        name: '随和',
        postsCount: 69
    },
    {
        name: '呐',
        postsCount: 98
    }
];

