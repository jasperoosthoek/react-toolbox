// Tests the packed package as a consumer gets it (run after `npm run build:lib`, see `npm run test:package`):
// - `@jasperoosthoek/react-toolbox/localization` loads with native Node `import` and `require()` through the package's
//   `exports`, without React (a `react` whose createContext throws, as in a React Server Component), and its types
//   resolve;
// - the main entry loads with `require()` (index.umd.js) and renders a LocalizationProvider.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, renameSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const name = '@jasperoosthoek/react-toolbox';
const failures = [];

const check = (label, fn) => {
  try {
    fn();
    console.log(`  ✓ ${label}`);
  } catch (error) {
    failures.push(label);
    // Node prints the failing source line, which is a whole minified bundle: show only the error lines
    const lines = [error.stderr, error.stdout, error.message].filter(Boolean).join('\n').trim().split('\n');
    const errorLines = lines.filter((line) => /Error\b|Expected|error TS|Found:/.test(line));
    const shown = (errorLines.length ? errorLines : lines.slice(-3)).map((line) => line.slice(0, 300));
    console.log(`  ✕ ${label}\n    ${shown.join('\n    ')}`);
  }
};

const run = (cwd, args, env = {}) =>
  execFileSync(process.execPath, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', stdio: 'pipe' }).trim();

const expectEqual = (actual, expected) => {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

const tmp = mkdtempSync(join(tmpdir(), 'react-toolbox-package-'));

// A consumer directory with the packed package in node_modules (extracted, not installed: no network needed)
const consumer = (dir, tarball) => {
  const packageDir = join(dir, 'node_modules', name);
  mkdirSync(dirname(packageDir), { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', dir]);
  renameSync(join(dir, 'package'), packageDir);
  return packageDir;
};

try {
  const tarballName = execFileSync('npm', ['pack', '--silent', '--pack-destination', tmp], { cwd: root, encoding: 'utf8' })
    .trim().split('\n').pop();
  const tarball = join(tmp, tarballName);
  console.log(`Packed ${tarballName}`);

  console.log(`${name}/localization (without React)`);
  const serverDir = join(tmp, 'server');
  const serverPackage = consumer(serverDir, tarball);
  const fakeReact = join(serverDir, 'node_modules', 'react');
  mkdirSync(fakeReact, { recursive: true });
  writeFileSync(join(fakeReact, 'package.json'), JSON.stringify({ name: 'react', version: '0.0.0', main: 'index.js' }));
  writeFileSync(
    join(fakeReact, 'index.js'),
    "exports.createContext = () => { throw new Error('createContext only works in Client Components'); };\n"
  );

  check('the fake react throws on createContext', () => {
    let threw = false;
    try {
      run(serverDir, ['-e', "require('react').createContext()"]);
    } catch {
      threw = true;
    }
    if (!threw) throw new Error('the fake react did not throw');
  });

  check('native import', () => {
    expectEqual(
      run(serverDir, ['--input-type=module', '-e',
        `import { createText, defaultLanguages } from '${name}/localization';
         console.log(createText({ en: { hi: (n) => 'Hi ' + n } }, 'nl')\`cancel\`, createText({}, 'en').byKey('ok'),
           createText({ en: { hi: (n) => 'Hi ' + n } }, 'nl')\`hi\${'Jan'}\`, Object.keys(defaultLanguages).join());`]),
      'Annuleren OK Hi Jan en,fr,nl'
    );
  });

  check('require() (Node 22.12+)', () => {
    expectEqual(
      run(serverDir, ['-e', `const { createText } = require('${name}/localization'); console.log(createText({}, 'fr')\`cancel\`)`]),
      'Annuler'
    );
  });

  check('dist/localization.mjs has no imports (localized-strings bundled, no React, no main bundle)', () => {
    const source = readFileSync(join(serverPackage, 'dist', 'localization.mjs'), 'utf8');
    const imports = source.match(/^\s*import\b.*$|\bfrom\s*["'][^"']+["']|\brequire\(/gm);
    if (imports) throw new Error(`Found: ${imports.join(', ')}`);
  });

  check('TypeScript resolves the types of the subpath', () => {
    writeFileSync(join(serverDir, 'check.ts'), [
      `import { createText, Text, AdditionalLocalization } from '${name}/localization';`,
      `const localization: AdditionalLocalization = { en: { hi: 'Hi' } };`,
      `const text: Text = createText(localization, 'en');`,
      `const out: string = text\`hi\`;`,
      `const has: boolean = text.hasKey('hi');`,
      `// @ts-expect-error the language must be a string`,
      `createText(localization, 1);`,
      `export { out, has };`,
    ].join('\n'));
    for (const moduleResolution of ['bundler', 'node16']) {
      execFileSync(process.execPath, [
        join(root, 'node_modules', 'typescript', 'bin', 'tsc'), '--noEmit', '--strict',
        '--module', moduleResolution === 'node16' ? 'node16' : 'esnext', '--moduleResolution', moduleResolution,
        'check.ts',
      ], { cwd: serverDir, encoding: 'utf8', stdio: 'pipe' });
    }
  });

  console.log(`${name} (main entry, require)`);
  const mainDir = join(tmp, 'main');
  consumer(mainDir, tarball);
  check('require() loads index.umd.js and renders a LocalizationProvider', () => {
    // The package's peer dependencies (react, react-dom, ...) come from this repository
    expectEqual(
      run(mainDir, ['-e', `
        const React = require('react');
        const { renderToString } = require('react-dom/server');
        const { LocalizationProvider, useLocalization } = require('${name}');
        const Cancel = () => React.createElement('span', null, useLocalization().text\`cancel\`);
        console.log(renderToString(React.createElement(LocalizationProvider, { lang: 'nl' }, React.createElement(Cancel))));
      `], { NODE_PATH: join(root, 'node_modules') }),
      '<span>Annuleren</span>'
    );
  });

  check('the package contains CHANGELOG.md', () => {
    if (!existsSync(join(serverPackage, 'CHANGELOG.md'))) throw new Error('CHANGELOG.md is missing');
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures.length) {
  console.log(`\n${failures.length} failed`);
  process.exit(1);
}
console.log('\nAll package checks passed');
