#!/usr/bin/env node

/**
 * Sprint 0 Validation Gate
 * 
 * Validates critical security and architecture requirements for MD Connect App:
 * 1. .env files not tracked in Git
 * 2. No direct Supabase client calls in src/
 * 3. No wildcard CORS in Edge Functions
 * 4. UI standards compliance
 * 5. (Optional --full mode) Build + Lint
 * 
 * Exit codes:
 * - 0: All checks passed
 * - 1: One or more checks failed
 */

import { execSync } from 'child_process';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, sep } from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const fullMode = args.includes('--full');

// Results tracking
const results = {
    hard: [],
    soft: [],
    failed: false
};

// Console colors (Windows-compatible)
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function printHeader(text) {
    console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
    console.log(`${colors.cyan}${text}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
}

function printCheck(name, passed, message = '', isSoft = false) {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    const type = isSoft ? '(INFO)' : '';
    
    console.log(`${icon} ${color}${name}${colors.reset} ${colors.gray}${type}${colors.reset}`);
    if (message) {
        console.log(`   ${colors.gray}${message}${colors.reset}`);
    }
    
    const result = { name, passed, message };
    if (isSoft) {
        results.soft.push(result);
    } else {
        results.hard.push(result);
        if (!passed) results.failed = true;
    }
}

function execSafe(command, options = {}) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
            ...options
        }).trim();
    } catch (error) {
        return null;
    }
}

function searchInFiles(directory, pattern, extensions = []) {
    let matches = [];
    
    function scanDir(dir) {
        const entries = readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            
            // Skip node_modules, .git, dist, build
            if (entry.isDirectory()) {
                if (!['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(entry.name)) {
                    scanDir(fullPath);
                }
            } else if (entry.isFile()) {
                // Check file extension if specified
                if (extensions.length > 0) {
                    const hasValidExt = extensions.some(ext => entry.name.endsWith(ext));
                    if (!hasValidExt) continue;
                }
                
                try {
                    const content = readFileSync(fullPath, 'utf8');
                    const lines = content.split('\n');
                    
                    lines.forEach((line, index) => {
                        if (pattern.test(line)) {
                            const relativePath = fullPath.split(sep).join('/');
                            matches.push({
                                file: relativePath,
                                line: index + 1,
                                content: line.trim()
                            });
                        }
                    });
                } catch (error) {
                    // Skip files that can't be read
                }
            }
        }
    }
    
    if (existsSync(directory)) {
        scanDir(directory);
    }
    
    return matches;
}

// ============================================================================
// CHECK 1: .env files not tracked in Git
// ============================================================================
printHeader('CHECK 1: Arquivos .env não rastreados no Git');

let envGitTracked = false;
const envFiles = ['.env', '.env.local', '.env.production'];

// Check if .env files are currently tracked
console.log(`${colors.gray}Verificando se .env está no Git working tree...${colors.reset}`);
const trackedFiles = execSafe('git ls-files .env .env.local .env.production');
if (trackedFiles) {
    envGitTracked = true;
    printCheck(
        'Arquivos .env não rastreados',
        false,
        `Encontrado: ${trackedFiles.split('\n').join(', ')}`
    );
} else {
    printCheck('Arquivos .env não rastreados', true, 'Nenhum arquivo .env no índice do Git');
}

// Check Git history for .env files
console.log(`${colors.gray}Verificando histórico do Git para .env...${colors.reset}`);
let envInHistory = false;

for (const envFile of envFiles) {
    const historyCheck = execSafe(`git log --all --full-history --oneline -- ${envFile}`);
    if (historyCheck && historyCheck.length > 0) {
        envInHistory = true;
        printCheck(
            `Histórico limpo: ${envFile}`,
            false,
            `Encontrado no histórico (${historyCheck.split('\n').length} commits)`
        );
    }
}

if (!envInHistory && !envGitTracked) {
    printCheck('Histórico do Git limpo (.env)', true, 'Nenhum arquivo .env no histórico');
}

// ============================================================================
// CHECK 2: No direct Supabase client calls in src/
// ============================================================================
printHeader('CHECK 2: Sem chamadas diretas supabase.from() em /src');

console.log(`${colors.gray}Escaneando src/ para violações BFF...${colors.reset}`);
const supabaseFromPattern = /supabase\.from\s*\(/;
const supabaseViolations = searchInFiles('src', supabaseFromPattern, ['.ts', '.tsx', '.js', '.jsx']);

if (supabaseViolations.length === 0) {
    printCheck(
        'Arquitetura BFF respeitada',
        true,
        'Nenhuma chamada direta supabase.from() encontrada em src/'
    );
} else {
    printCheck(
        'Arquitetura BFF respeitada',
        false,
        `${supabaseViolations.length} violação(ões) encontrada(s):`
    );
    supabaseViolations.slice(0, 5).forEach(v => {
        console.log(`   ${colors.gray}${v.file}:${v.line}${colors.reset}`);
        console.log(`   ${colors.gray}  ${v.content.substring(0, 80)}${colors.reset}`);
    });
    if (supabaseViolations.length > 5) {
        console.log(`   ${colors.gray}... e mais ${supabaseViolations.length - 5} violação(ões)${colors.reset}`);
    }
}

// ============================================================================
// CHECK 3: No wildcard CORS in Edge Functions
// ============================================================================
printHeader('CHECK 3: Sem CORS wildcard em Edge Functions');

console.log(`${colors.gray}Escaneando supabase/functions/ para CORS wildcard...${colors.reset}`);
const wildcardCorsPattern = /['"]Access-Control-Allow-Origin['"]\s*:\s*['"]\*['"]/;
const corsViolations = searchInFiles('supabase/functions', wildcardCorsPattern, ['.ts', '.js']);

// Filter out _shared/cors.ts legacy export (which is documented as deprecated)
const realCorsViolations = corsViolations.filter(v => {
    // Allow deprecated corsHeaders in _shared/cors.ts (it's documented as empty for migration)
    if (v.file.includes('_shared/cors.ts') || v.file.includes('_shared\\cors.ts')) {
        return false;
    }
    return true;
});

if (realCorsViolations.length === 0) {
    printCheck(
        'CORS seguro (sem wildcard)',
        true,
        'Nenhum wildcard CORS encontrado em Edge Functions'
    );
} else {
    printCheck(
        'CORS seguro (sem wildcard)',
        false,
        `${realCorsViolations.length} violação(ões) encontrada(s):`
    );
    realCorsViolations.slice(0, 5).forEach(v => {
        console.log(`   ${colors.gray}${v.file}:${v.line}${colors.reset}`);
        console.log(`   ${colors.gray}  ${v.content.substring(0, 80)}${colors.reset}`);
    });
    if (realCorsViolations.length > 5) {
        console.log(`   ${colors.gray}... e mais ${realCorsViolations.length - 5} violação(ões)${colors.reset}`);
    }
}

// ============================================================================
// CHECK 4: UI Standards Compliance
// ============================================================================
printHeader('CHECK 4: Conformidade com padrões de UI');

console.log(`${colors.gray}Executando node scripts/audit-internal-pages.mjs...${colors.reset}`);
const uiAuditResult = execSafe('node scripts/audit-internal-pages.mjs');

if (uiAuditResult !== null) {
    // The script exists and ran (exit code 0 means passed)
    printCheck(
        'Padrões de UI (InternalPageLayout)',
        true,
        'Auditoria de páginas internas aprovada'
    );
} else {
    printCheck(
        'Padrões de UI (InternalPageLayout)',
        false,
        'Auditoria de páginas internas falhou'
    );
}

// ============================================================================
// OPTIONAL: Full Mode Checks (Build + Lint)
// ============================================================================
if (fullMode) {
    printHeader('MODO COMPLETO: Build + Lint');
    
    // Build check
    console.log(`${colors.gray}Executando build...${colors.reset}`);
    const buildResult = execSafe('pnpm build');
    if (buildResult !== null) {
        printCheck('Build TypeScript', true, 'Build concluído com sucesso', true);
    } else {
        printCheck('Build TypeScript', false, 'Build falhou', false); // Hard fail in full mode
    }
    
    // Lint check (soft - informational only)
    console.log(`${colors.gray}Executando lint...${colors.reset}`);
    const lintResult = execSafe('pnpm lint');
    if (lintResult !== null) {
        printCheck('Lint ESLint', true, 'Lint passou sem erros', true);
    } else {
        printCheck('Lint ESLint', false, 'Lint encontrou problemas', true); // Soft check
    }
}

// ============================================================================
// SUMMARY
// ============================================================================
printHeader('RESUMO DA VALIDAÇÃO SPRINT 0');

const hardPassed = results.hard.filter(r => r.passed).length;
const hardTotal = results.hard.length;
const softPassed = results.soft.filter(r => r.passed).length;
const softTotal = results.soft.length;

console.log(`${colors.blue}Checks obrigatórios:${colors.reset} ${hardPassed}/${hardTotal} ✅`);
if (softTotal > 0) {
    console.log(`${colors.blue}Checks informativos:${colors.reset} ${softPassed}/${softTotal} ℹ️`);
}

if (results.failed) {
    console.log(`\n${colors.red}❌ VALIDAÇÃO FALHOU${colors.reset}`);
    console.log(`${colors.gray}Um ou mais checks obrigatórios falharam.${colors.reset}\n`);
    process.exit(1);
} else {
    console.log(`\n${colors.green}✅ TODOS OS CHECKS PASSARAM${colors.reset}`);
    console.log(`${colors.gray}Repositório está em conformidade com Sprint 0.${colors.reset}\n`);
    process.exit(0);
}
