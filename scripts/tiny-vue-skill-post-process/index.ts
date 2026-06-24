import fs from 'fs/promises';
import path from 'path';
import * as esprima from 'esprima';
import * as estraverse from 'estraverse';
import * as escodegen from 'escodegen';

async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function compressFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // use AST-based compression
    const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });
    // attach comments (preserve but we will drop them in generation)
    const compact = escodegen.generate(ast, { format: { compact: true } });
    await fs.writeFile(filePath, compact, 'utf8');
    console.log('Compressed', filePath);
  } catch (err) {
    console.error('Failed to compress', filePath, err);
  }
}

async function removeFilesByFilter(dir: string, filter: (name: string) => boolean) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        continue;
      }
      if (filter(e.name)) {
        await fs.unlink(full);
        console.log('Deleted', full);
      }
    }
  } catch (err) {
    // ignore if dir missing
  }
}

async function removeFilesByFilterRecursive(dir: string, filter: (name: string) => boolean) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await removeFilesByFilterRecursive(full, filter);
        continue;
      }
      if (filter(e.name)) {
        await fs.unlink(full);
        console.log('Deleted', full);
      }
    }
  } catch (err) {
    // ignore if dir missing
  }
}

// ********** Process APIs **********
async function processApis(apisDir: string) {
  try {
    const entries = await fs.readdir(apisDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith('.js')) continue;
      const full = path.join(apisDir, e.name);
      let content = await fs.readFile(full, 'utf8');

      try {
        // Parse the JS content to get the data structure
        const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });

        // Extract the default export object
        let exportData: any = null;
        estraverse.traverse(ast, {
          enter(node) {
            if (node.type === 'ExportDefaultDeclaration' && node.declaration) {
              // Evaluate the AST to get the actual data
              const code = escodegen.generate(node.declaration);
              try {
                // eslint-disable-next-line no-new-func
                exportData = new Function('return ' + code)();
              } catch (err) {
                console.error('Failed to evaluate', full, err);
              }
            }
          },
        });

        if (!exportData || !exportData.apis) {
          // eslint-disable-next-line no-console
          console.log('Skipping', full, '- no apis found');
          continue;
        }

        // Convert to markdown format
        const mdContent = convertToMarkdown(exportData);

        // Save as .md file
        const mdPath = full.replace(/\.js$/, '.md');
        await fs.unlink(full);
        await fs.writeFile(mdPath, mdContent, 'utf8');

        // eslint-disable-next-line no-console
        console.log('Processed API', full, '->', mdPath);
      } catch (parseErr) {
        console.error(
          'Failed to process',
          full,
          '-',
          parseErr instanceof Error ? parseErr.message : parseErr
        );
      }
    }
  } catch (err) {
    console.error('processApis failed', apisDir, err);
  }
}

function convertToMarkdown(data: any): string {
  const lines: string[] = [];

  // // Add mode info if exists
  // if (data.mode && data.mode.length > 0) {
  //   lines.push(`**支持模式**: ${data.mode.join(', ')}`);
  //   lines.push('');
  // }

  // Process each API component
  if (data.apis && Array.isArray(data.apis)) {
    for (const api of data.apis) {
      lines.push(`## ${api.name}`);
      lines.push('');

      // Props table
      if (api.props && api.props.length > 0) {
        lines.push('### Props');
        lines.push('');
        lines.push('| 属性名 | 类型 | 默认值 | 说明 |');
        lines.push('|--------|------|--------|------|');
        for (const prop of api.props) {
          const name = prop.name || '';
          const type = prop.type || '';
          const defaultValue = prop.defaultValue !== undefined ? prop.defaultValue : '';
          const desc = prop.desc && prop.desc['zh-CN'] ? prop.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(
              String(defaultValue)
            )} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Events table
      if (api.events && api.events.length > 0) {
        lines.push('### Events');
        lines.push('');
        lines.push('| 事件名 | 回调参数 | 说明 |');
        lines.push('|--------|----------|------|');
        for (const event of api.events) {
          const name = event.name || '';
          const type = event.type || '';
          const desc = event.desc && event.desc['zh-CN'] ? event.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Methods table
      if (api.methods && api.methods.length > 0) {
        lines.push('### Methods');
        lines.push('');
        lines.push('| 方法名 | 返回值 | 说明 |');
        lines.push('|--------|--------|------|');
        for (const method of api.methods) {
          const name = method.name || '';
          const type = method.type || '';
          const desc = method.desc && method.desc['zh-CN'] ? method.desc['zh-CN'] : '';
          lines.push(
            `| ${escapeTableCell(name)} | ${escapeTableCell(type)} | ${escapeTableCell(desc)} |`
          );
        }
        lines.push('');
      }

      // Slots table
      if (api.slots && api.slots.length > 0) {
        lines.push('### Slots');
        lines.push('');
        lines.push('| 插槽名 | 说明 |');
        lines.push('|--------|------|');
        for (const slot of api.slots) {
          const name = slot.name || '';
          const desc = slot.desc && slot.desc['zh-CN'] ? slot.desc['zh-CN'] : '';
          lines.push(`| ${escapeTableCell(name)} | ${escapeTableCell(desc)} |`);
        }
        lines.push('');
      }
    }
  }

  // Process types
  if (data.types && Array.isArray(data.types)) {
    lines.push('## Types');
    lines.push('');
    for (const type of data.types) {
      lines.push(`### ${type.name}`);
      lines.push('');
      if (type.code) {
        lines.push('```typescript');
        lines.push(type.code.trim());
        lines.push('```');
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

function escapeTableCell(text: string): string {
  if (!text) return '';
  // Escape pipe characters and newlines in table cells
  return String(text).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

// ********** Process Demos **********
async function processDemos(demosDir: string) {
  try {
    // 遍历所有组件目录
    const componentDirs = await fs.readdir(demosDir, { withFileTypes: true });

    for (const componentDir of componentDirs) {
      if (!componentDir.isDirectory()) continue;

      const componentName = componentDir.name;
      const webdocPath = path.join(demosDir, componentName, 'webdoc');

      // 检查 webdoc 目录是否存在
      if (!(await fileExists(webdocPath))) continue;

      // 读取 webdoc 目录下的所有 JS 文件
      const jsFiles = await fs.readdir(webdocPath, { withFileTypes: true });

      for (const jsFile of jsFiles) {
        if (!jsFile.isFile() || !jsFile.name.endsWith('.js')) continue;

        const jsFilePath = path.join(webdocPath, jsFile.name);

        try {
          const content = await fs.readFile(jsFilePath, 'utf8');

          // 解析 JS 文件获取 demos 数据
          const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });

          let demosData: any[] = [];
          estraverse.traverse(ast, {
            enter(node) {
              if (node.type === 'ExportDefaultDeclaration' && node.declaration) {
                const code = escodegen.generate(node.declaration);
                try {
                  // eslint-disable-next-line no-new-func
                  const exportData = new Function('return ' + code)();
                  if (exportData && exportData.demos && Array.isArray(exportData.demos)) {
                    demosData = exportData.demos;
                  }
                } catch (err) {
                  console.error('Failed to evaluate', jsFilePath, err);
                }
              }
            },
          });

          if (demosData.length === 0) {
            console.log('Skipping', jsFilePath, '- no demos found');
            continue;
          }

          // 生成 Markdown 表格
          const mdContent = convertDemosToMarkdown(demosData, componentName);

          // 保存为同名 .md 文件
          const mdFilePath = jsFilePath.replace(/\.js$/, '.md');
          await fs.unlink(jsFilePath);
          await fs.writeFile(mdFilePath, mdContent, 'utf8');

          console.log('Processed Demo', jsFilePath, '->', mdFilePath);
        } catch (parseErr) {
          console.error(
            'Failed to process demo',
            jsFilePath,
            '-',
            parseErr instanceof Error ? parseErr.message : parseErr
          );
        }
      }
    }
  } catch (err) {
    console.error('processDemos failed', demosDir, err);
  }
}

function extractExportedArray(content: string, exportName: string): string | null {
  const marker = `export const ${exportName} = `;
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return null;

  let i = markerIndex + marker.length;
  while (i < content.length && /\s/.test(content[i])) i++;
  if (content[i] !== '[') return null;

  const arrayStart = i;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  while (i < content.length) {
    const ch = content[i];

    if (escaped) {
      escaped = false;
      i++;
      continue;
    }

    if (inSingle) {
      if (ch === '\\') escaped = true;
      else if (ch === "'") inSingle = false;
      i++;
      continue;
    }

    if (inDouble) {
      if (ch === '\\') escaped = true;
      else if (ch === '"') inDouble = false;
      i++;
      continue;
    }

    if (inTemplate) {
      if (ch === '\\') escaped = true;
      else if (ch === '`') inTemplate = false;
      i++;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      i++;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      i++;
      continue;
    }
    if (ch === '`') {
      inTemplate = true;
      i++;
      continue;
    }
    if (ch === '/' && content[i + 1] === '/') {
      while (i < content.length && content[i] !== '\n') i++;
      continue;
    }

    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return content.slice(arrayStart, i + 1);
      }
    }

    i++;
  }

  return null;
}

// ********** Process Menus **********
async function processMenus(menusPath: string) {
  try {
    const content = await fs.readFile(menusPath, 'utf8');
    const arrayLiteral = extractExportedArray(content, 'cmpMenus');

    if (!arrayLiteral) {
      console.log('Skipping', menusPath, '- no cmpMenus found');
      return;
    }

    let cmpMenusData: any[] = [];
    try {
      // eslint-disable-next-line no-new-func
      cmpMenusData = new Function('return ' + arrayLiteral)();
    } catch (err) {
      console.error('Failed to evaluate cmpMenus', menusPath, err);
      return;
    }

    if (!Array.isArray(cmpMenusData) || cmpMenusData.length === 0) {
      console.log('Skipping', menusPath, '- cmpMenus is empty');
      return;
    }

    const mdContent = convertCmpMenusToMarkdown(cmpMenusData);
    const mdPath = path.join(path.dirname(menusPath), 'menu.md');
    await fs.unlink(menusPath);
    await fs.writeFile(mdPath, mdContent, 'utf8');
    console.log('Processed Menus', menusPath, '->', mdPath);
  } catch (parseErr) {
    console.error(
      'Failed to process menus',
      menusPath,
      '-',
      parseErr instanceof Error ? parseErr.message : parseErr
    );
  }
}

function convertCmpMenusToMarkdown(cmpMenus: any[]): string {
  const lines: string[] = [];
  lines.push('# 组件目录');
  lines.push('');

  for (const category of cmpMenus) {
    const label = category.label || '';
    const labelEn = category.labelEn || '';
    lines.push(`## ${label}${labelEn ? ` (${labelEn})` : ''}`);
    lines.push('');
    lines.push('| 中文名 | 组件名 | key |');
    lines.push('|--------|--------|-----|');

    if (category.children && Array.isArray(category.children)) {
      for (const item of category.children) {
        const nameCn = item.nameCn || '';
        const name = item.name || '';
        const key = item.key || '';
        lines.push(
          `| ${escapeTableCell(nameCn)} | ${escapeTableCell(name)} | ${escapeTableCell(key)} |`
        );
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function convertDemosToMarkdown(demos: any[], componentName: string): string {
  const lines: string[] = [];

  // 添加标题
  lines.push(`# ${componentName} Demos`);
  lines.push('');

  // 创建表格头
  lines.push('| demoId | 名称 | 描述 | 代码文件 |');
  lines.push('|--------|------|------|----------|');

  // 遍历每个 demo
  for (const demo of demos) {
    const demoId = demo.demoId || '';
    const name = demo.name && demo.name['zh-CN'] ? demo.name['zh-CN'] : '';
    const desc = demo.desc && demo.desc['zh-CN'] ? demo.desc['zh-CN'] : '';

    // 处理 codeFiles，拼接组件名
    let codeFilesStr = '';
    if (demo.codeFiles && Array.isArray(demo.codeFiles)) {
      codeFilesStr = demo.codeFiles.map((file: string) => `${componentName}/${file}`).join('<br>');
    }

    lines.push(
      `| ${escapeTableCell(demoId)} | ${escapeTableCell(name)} | ${escapeTableCell(
        desc
      )} | ${escapeTableCell(codeFilesStr)} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

// ***************** 正式处理逻辑 ******************
async function process() {
  const target = '../skills/tiny-vue-skill';

  // 1. extract cmpMenus from menus.js and save as menu.md table
  const menusPath = path.join(target, 'menus.js');

  if (await fileExists(menusPath)) {
    await processMenus(menusPath);
  }

  // 2. webdoc: delete *-en.md and files starting with changelog, aui, introduce
  const webdocDir = path.join(target, 'webdoc');
  await removeFilesByFilter(webdocDir, (name) => {
    if (name.endsWith('-en.md')) return true;
    const lower = name.toLowerCase();
    return (
      lower.startsWith('changelog') || lower.startsWith('aui') || lower.startsWith('introduce')
    );
  });

  // 3. apis: 最新策略是将js 转为 md文件，减少 1/3 的体积
  const apisDir = path.join(target, 'apis');
  await processApis(apisDir);

  // 4. demos: delete all *.md and *.spec.ts files (recursive)
  const demosDir = path.join(target, 'demos');
  await removeFilesByFilterRecursive(
    demosDir,
    (name) => name.endsWith('.md') || name.endsWith('.spec.ts')
  );

  // 5. demos: 遍历所有 js 文件，提取 demos 属性并转为 md 表格
  await processDemos(demosDir);
  // 6. compress demos/icon/iconGroups.js
  const iconGroups = path.join(demosDir, 'icon', 'iconGroups.js');
  if (await fileExists(iconGroups)) {
    await compressFile(iconGroups);
  }

  console.log('Done.');
}

process().catch((err) => {
  console.error(err);
  process.exit(1);
});
