#!/usr/bin/env node

/**
 * Update all Edge Functions to use the new CORS API with origin parameter
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const functionsDir = './supabase/functions';

// Get all function directories (exclude _shared)
const functions = readdirSync(functionsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== '_shared')
    .map(dirent => dirent.name);

console.log(`Found ${functions.length} Edge Functions to update\n`);

const results = {
    updated: [],
    alreadyCorrect: [],
    errors: []
};

functions.forEach(funcName => {
    const indexPath = join(functionsDir, funcName, 'index.ts');
    
    try {
        let content = readFileSync(indexPath, 'utf-8');
        const original = content;
        
        // Check if function uses shared CORS helpers
        const usesSharedCors = content.includes("from '../_shared/cors.ts'");
        
        if (!usesSharedCors) {
            // Skip functions that don't use shared CORS (will handle separately)
            results.alreadyCorrect.push(funcName);
            return;
        }
        
        // Check if origin is already extracted
        const hasOriginExtraction = content.includes("req.headers.get('origin')");
        
        if (!hasOriginExtraction) {
            // Add origin extraction after handleCors call
            content = content.replace(
                /(const corsResponse = handleCors\(req\);?\s+if \(corsResponse\) return corsResponse;)/,
                '$1\n\n    // Get origin for CORS validation\n    const origin = req.headers.get(\'origin\');'
            );
        }
        
        // Update all jsonResponse calls that don't have origin parameter
        // Pattern 1: jsonResponse(data, status) at end of line
        content = content.replace(
            /jsonResponse\(([^,)]+),\s*(\d+)\)(?!,)/g,
            'jsonResponse($1, $2, origin)'
        );
        
        // Pattern 2: jsonResponse with object literal (multiline)
        // This is trickier - we'll mark lines that end with status number
        const lines = content.split('\n');
        const updatedLines = lines.map((line, idx) => {
            // Match lines like: }, 200) or }, 400) etc.
            if (/},\s*(\d+)\)$/.test(line) && idx > 0) {
                // Check if previous lines have jsonResponse
                const prevLines = lines.slice(Math.max(0, idx - 10), idx).join('\n');
                if (prevLines.includes('jsonResponse') && !line.includes(', origin')) {
                    return line.replace(/},\s*(\d+)\)$/, '}, $1, origin)');
                }
            }
            return line;
        });
        content = updatedLines.join('\n');
        
        if (content !== original) {
            writeFileSync(indexPath, content, 'utf-8');
            results.updated.push(funcName);
            console.log(`✅ Updated: ${funcName}`);
        } else {
            results.alreadyCorrect.push(funcName);
            console.log(`✓  Already correct: ${funcName}`);
        }
        
    } catch (error) {
        results.errors.push({ funcName, error: error.message });
        console.error(`❌ Error updating ${funcName}:`, error.message);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Updated: ${results.updated.length}`);
console.log(`Already correct: ${results.alreadyCorrect.length}`);
console.log(`Errors: ${results.errors.length}`);

if (results.errors.length > 0) {
    console.log(`\nErrors:`);
    results.errors.forEach(({ funcName, error }) => {
        console.log(`  - ${funcName}: ${error}`);
    });
    process.exit(1);
}

console.log('\n✅ All Edge Functions updated successfully!');
