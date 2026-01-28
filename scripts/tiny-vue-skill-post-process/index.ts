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

function removeEnUSFromDescAst(content: string) {
  const ast = esprima.parseModule(content, { range: true, comment: true, tokens: true });
  estraverse.traverse(ast, {
    enter(node) {
      // find Property nodes where key === 'desc' and value is ObjectExpression
      if (node.type === 'Property') {
        const key = (node as any).key;
        const value = (node as any).value;
        let name: string | null = null;
        if (key) {
          if (key.type === 'Literal') name = String((key as any).value);
          else if (key.type === 'Identifier') name = (key as any).name;
        }
        if (name === 'desc' && value && value.type === 'ObjectExpression') {
          (value as any).properties = (value as any).properties.filter((p: any) => {
            let pn: string | null = null;
            const pk = p.key;
            if (pk) {
              if (pk.type === 'Literal') pn = String(pk.value);
              else if (pk.type === 'Identifier') pn = pk.name;
            }
            return pn !== 'en-US';
          });
        }
      }
    },
  });
  return escodegen.generate(ast, { format: { compact: true } });
}

async function compressJsRecursive(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await compressJsRecursive(full);
        continue;
      }
      if (e.isFile() && e.name.endsWith('.js')) {
        await compressFile(full);
      }
    }
  } catch (err) {
    // ignore missing dirs
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

async function processApis(apisDir: string) {
  try {
    const entries = await fs.readdir(apisDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!e.name.endsWith('.js')) continue;
      const full = path.join(apisDir, e.name);
      let content = await fs.readFile(full, 'utf8');
      // remove 'en-US' properties inside desc via AST and compress
      const out = removeEnUSFromDescAst(content);
      await fs.writeFile(full, out, 'utf8');
      console.log('Processed API', full);
    }
  } catch (err) {
    console.error('processApis failed', apisDir, err);
  }
}

async function process() {
  const target = '../skills/tiny-vue-skill';

  // 1. compress menus.js (not mangling variable names)
  const menusPath = path.join(target, 'menus.js');

  if (await fileExists(menusPath)) {
    await compressFile(menusPath);
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

  // 3. apis: remove en-US in desc and compress js files
  const apisDir = path.join(target, 'apis');
  await processApis(apisDir);

  // 4. demos: delete all *.md and *.spec.ts files (recursive)
  const demosDir = path.join(target, 'demos');
  await removeFilesByFilterRecursive(
    demosDir,
    (name) => name.endsWith('.md') || name.endsWith('.spec.ts')
  );

  // 5. demos: recursively compress all *.js files
  await compressJsRecursive(demosDir);

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
