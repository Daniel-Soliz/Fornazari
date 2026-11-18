import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('assets', { recursive: true });
cpSync('dist/assets', 'assets', { recursive: true });
cpSync('dist/index.html', 'index.html');

const adminPage = readFileSync('dist/index.html', 'utf8')
  .replace('<title>Fornazari', '<title>Painel administrativo | Fornazari')
  .replace('property="og:title" content="Fornazari', 'property="og:title" content="Painel administrativo | Fornazari')
  .replace('<head>', `<head>
    <script>history.replaceState(null, '', '../?pagina=admin');</script>`);
for (const directory of ['admin', 'dist/admin']) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(directory + '/index.html', adminPage);
}
