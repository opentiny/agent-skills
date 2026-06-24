# tiny vue skill的后处理

复制文档到skills目录之后，需要对文档进行压缩处理，防止token膨胀和读取100行之类的问题。

在工程的根目录 `skills\tiny-vye-skill` 中需要处理以下事项：

1. 从 menus.js 提取 cmpMenus 变量，转为 menu.md 表格并删除 menus.js
2. 在 `webdoc` 目录中，删除所有以 `-en.md` 结尾的文件, 删除 `changelog`,`aui`,`introduce`打头的文件。
3. 在 `apis` 目录中，遍历所有的 `*.js` 文件，删除所有`desc`属性中 `en-US`的属性值。然后压缩该 js 文件。
4. 在 `demos` 目录中，递归删除所有 `*.md`的文件和所有`*.spec.ts`的文件，
5. 在 `demos` 目录中， 递归压缩所有 `*.js` 文件。

所有删除`en-US`的属性值和压缩js的时候，要使用 JS AST方案。压缩的目标是保持变量名不变，行尾添加分号把多行变为一行，尽量压缩代码行数。
