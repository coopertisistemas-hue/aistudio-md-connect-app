import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const pagesDir = join(projectRoot, 'src', 'pages');

// Páginas especiais que não precisam de InternalPageLayout
const SPECIAL_PAGES = [
    'src/pages/Home.tsx',
    'src/pages/PublicHome.tsx',
    'src/pages/LandingPage.tsx',
    'src/pages/Login.tsx',
    'src/pages/status/GateScreens.tsx',
    'src/pages/public/RadioPage.tsx',
];

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

/**
 * Recursively find all .tsx files in a directory
 */
async function findTsxFiles(dir, fileList = []) {
    const files = await readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
            await findTsxFiles(fullPath, fileList);
        } else if (file.name.endsWith('.tsx')) {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

/**
 * Check if a file is a special page (doesn't need InternalPageLayout)
 */
function isSpecialPage(relativePath) {
    return SPECIAL_PAGES.some(sp => relativePath === sp);
}

/**
 * Analyze a single file for InternalPageLayout usage and direct imports
 */
async function analyzeFile(filePath) {
    const content = await readFile(filePath, 'utf-8');
    const relativePath = relative(projectRoot, filePath).replace(/\\/g, '/');

    const hasInternalPageLayout = content.includes('InternalPageLayout');
    const directImports = [];

    // Check for direct imports of layout components
    if (content.match(/import.*AppFooter.*from/)) {
        directImports.push('AppFooter');
    }
    if (content.match(/import.*PageIntro.*from/)) {
        directImports.push('PageIntro');
    }
    if (content.match(/import.*BackLink.*from/)) {
        directImports.push('BackLink');
    }

    return {
        path: relativePath,
        hasInternalPageLayout,
        directImports,
    };
}

/**
 * Main audit function
 */
async function auditInternalPages() {
    console.log(`${colors.bold}${colors.cyan}🔍 Auditoria de Páginas Internas MD Connect${colors.reset}`);
    console.log(`${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    try {
        // Find all .tsx files in src/pages
        const files = await findTsxFiles(pagesDir);

        if (files.length === 0) {
            console.log(`${colors.yellow}⚠️  Nenhum arquivo .tsx encontrado em src/pages${colors.reset}`);
            return;
        }

        // Analyze each file
        const results = await Promise.all(files.map(analyzeFile));

        // Categorize results
        const specialPages = results.filter(r => isSpecialPage(r.path));
        const regularPages = results.filter(r => !isSpecialPage(r.path));
        const withInternalPageLayout = regularPages.filter(r => r.hasInternalPageLayout);
        const withoutInternalPageLayout = regularPages.filter(r => !r.hasInternalPageLayout);
        const withDirectImports = regularPages.filter(r => r.directImports.length > 0);

        // Calculate percentages (only for regular pages)
        const totalFiles = results.length;
        const totalRegularPages = regularPages.length;
        const conformanceRate = totalRegularPages > 0 ? ((withInternalPageLayout.length / totalRegularPages) * 100).toFixed(1) : '0.0';
        const nonConformanceRate = totalRegularPages > 0 ? ((withoutInternalPageLayout.length / totalRegularPages) * 100).toFixed(1) : '0.0';
        const directImportsRate = totalRegularPages > 0 ? ((withDirectImports.length / totalRegularPages) * 100).toFixed(1) : '0.0';

        // Print statistics
        console.log(`${colors.bold}📊 Estatísticas:${colors.reset}`);
        console.log(`  Total de páginas: ${colors.bold}${totalFiles}${colors.reset} (${totalRegularPages} regulares + ${specialPages.length} especiais)`);
        console.log(`  ${colors.green}✅ Usando InternalPageLayout: ${withInternalPageLayout.length} (${conformanceRate}%)${colors.reset}`);
        console.log(`  ${colors.red}❌ Sem InternalPageLayout: ${withoutInternalPageLayout.length} (${nonConformanceRate}%)${colors.reset}`);
        console.log(`  ${colors.yellow}⚠️  Com importações diretas: ${withDirectImports.length} (${directImportsRate}%)${colors.reset}`);
        console.log();

        // Print special pages (ignored from audit)
        if (specialPages.length > 0) {
            console.log(`${colors.bold}${colors.blue}ℹ️  Páginas Especiais (ignorar) (${specialPages.length}):${colors.reset}`);
            specialPages.forEach(result => {
                console.log(`  ${colors.gray}-${colors.reset} ${result.path}`);
            });
            console.log();
        }

        // Print pages WITHOUT InternalPageLayout
        if (withoutInternalPageLayout.length > 0) {
            console.log(`${colors.bold}${colors.red}❌ Páginas SEM InternalPageLayout (${withoutInternalPageLayout.length}):${colors.reset}`);
            withoutInternalPageLayout.forEach(result => {
                console.log(`  ${colors.gray}-${colors.reset} ${result.path}`);
            });
            console.log();
        }

        // Print pages WITH direct imports
        if (withDirectImports.length > 0) {
            console.log(`${colors.bold}${colors.yellow}⚠️  Páginas com importações diretas (${withDirectImports.length}):${colors.reset}`);
            withDirectImports.forEach(result => {
                const imports = result.directImports.join(', ');
                console.log(`  ${colors.gray}-${colors.reset} ${result.path} ${colors.gray}(${imports})${colors.reset}`);
            });
            console.log();
        }

        // Print pages WITH InternalPageLayout (conformant)
        if (withInternalPageLayout.length > 0) {
            console.log(`${colors.bold}${colors.green}✅ Páginas CONFORMES (${withInternalPageLayout.length}):${colors.reset}`);
            withInternalPageLayout.forEach(result => {
                console.log(`  ${colors.gray}-${colors.reset} ${result.path}`);
            });
            console.log();
        }

        // Summary recommendation
        console.log(`${colors.gray}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        if (withoutInternalPageLayout.length === 0 && withDirectImports.length === 0) {
            console.log(`${colors.bold}${colors.green}🎉 Parabéns! Todas as páginas estão usando InternalPageLayout!${colors.reset}`);
        } else {
            console.log(`${colors.bold}${colors.red}❌ FALHA: Páginas não conformes encontradas!${colors.reset}`);
            console.log(`${colors.yellow}💡 Recomendação:${colors.reset} Migrar páginas para usar ${colors.cyan}InternalPageLayout${colors.reset}`);
            console.log(`   Veja o relatório completo em: ${colors.gray}audit/auditoria_paginas.md${colors.reset}`);
        }
        console.log();

        // Exit with appropriate code for CI/CD
        if (withoutInternalPageLayout.length > 0 || withDirectImports.length > 0) {
            process.exit(1); // FAILURE - non-conformant pages found
        }
        // SUCCESS - all pages conformant (exit 0 is implicit)

    } catch (error) {
        console.error(`${colors.red}❌ Erro ao executar auditoria:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Run the audit
auditInternalPages();
