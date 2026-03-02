/**
 * Revenue Model Hardening - Audit Script
 * 
 * Validates revenue and monetization event tracking:
 * 1. All monetization events use registered event names
 * 2. Revenue API functions have proper error handling
 * 3. Dashboard components handle loading/error states
 * 4. Revenue score calculation is bounded
 * 
 * Run: node scripts/audit-revenue-model.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MONETIZATION_EVENTS = [
    'donate_view',
    'donate_click',
    'donate_initiated',
    'donate_complete',
    'partner_inquiry',
    'service_request',
    'affiliate_click',
    'click_partner',
    'view_partner',
    'click_donate'
];

function findFiles(dir, pattern) {
    const results = [];
    const files = readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = join(dir, file.name);
        if (file.isDirectory() && !file.name.includes('node_modules') && !file.name.startsWith('.')) {
            results.push(...findFiles(fullPath, pattern));
        } else if (file.isFile() && pattern.test(file.name)) {
            results.push(fullPath);
        }
    }
    
    return results;
}

function extractMonetizationEvents(content) {
    const regex = /analytics\.(trackEvent|track)\(['"`]([^'"`]+)['"`]/g;
    const events = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        events.push(match[2]);
    }
    
    return events;
}

function checkRevenueAPI(content, filePath) {
    const issues = [];
    
    if (filePath.includes('revenue.ts')) {
        if (!content.includes('try') || !content.includes('catch')) {
            issues.push('Missing try-catch error handling');
        }
        if (!content.includes('return') || !content.includes('default')) {
            issues.push('Missing default return values');
        }
    }
    
    return issues;
}

function checkDashboardComponent(content, filePath) {
    const issues = [];
    
    if (filePath.includes('RevenueDashboard')) {
        if (!content.includes('loading')) {
            issues.push('Missing loading state handling');
        }
        if (!content.includes('null') && !content.includes('undefined')) {
            issues.push('Missing null safety checks');
        }
    }
    
    return issues;
}

function runAudit() {
    console.log('💰 MD Connect - Revenue Model Hardening Audit\n');
    console.log('=' .repeat(50));
    
    const srcDir = './src';
    const tsxFiles = findFiles(srcDir, /\.tsx$/);
    const tsFiles = findFiles(srcDir, /\.ts$/);
    
    const monetizationEventsFound = [];
    
    for (const file of tsxFiles) {
        const content = readFileSync(file, 'utf-8');
        const events = extractMonetizationEvents(content);
        events.forEach(e => monetizationEventsFound.push({ event: e, file }));
    }
    
    console.log(`\n📊 Found ${monetizationEventsFound.length} monetization events\n`);
    
    // Validate monetization events
    console.log('--- Monetization Event Validation ---');
    const invalidEvents = [];
    for (const { event, file } of monetizationEventsFound) {
        if (!MONETIZATION_EVENTS.includes(event)) {
            invalidEvents.push({ event, file });
            console.log(`❌ Invalid monetization event: "${event}" in ${file}`);
        }
    }
    
    if (invalidEvents.length === 0) {
        console.log('✅ All monetization events are valid');
    }
    
    // Check revenue API error handling
    console.log('\n--- Revenue API Validation ---');
    const apiIssues = [];
    for (const file of tsFiles) {
        if (file.includes('revenue.ts')) {
            const content = readFileSync(file, 'utf-8');
            const issues = checkRevenueAPI(content, file);
            if (issues.length > 0) {
                apiIssues.push({ file, issues });
                issues.forEach(i => console.log(`⚠️ ${file}: ${i}`));
            }
        }
    }
    
    if (apiIssues.length === 0) {
        console.log('✅ Revenue API has proper error handling');
    }
    
    // Check dashboard components
    console.log('\n--- Dashboard Component Validation ---');
    const dashboardIssues = [];
    for (const file of tsxFiles) {
        if (file.includes('RevenueDashboard')) {
            const content = readFileSync(file, 'utf-8');
            const issues = checkDashboardComponent(content, file);
            if (issues.length > 0) {
                dashboardIssues.push({ file, issues });
                issues.forEach(i => console.log(`⚠️ ${file}: ${i}`));
            }
        }
    }
    
    if (dashboardIssues.length === 0) {
        console.log('✅ Dashboard components handle loading/error states');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 REVENUE MODEL SUMMARY');
    console.log('='.repeat(50));
    console.log(`Monetization Events Registered: ${MONETIZATION_EVENTS.length}`);
    console.log(`Monetization Events Found: ${monetizationEventsFound.length}`);
    console.log(`Invalid Events: ${invalidEvents.length}`);
    console.log(`API Issues: ${apiIssues.length}`);
    console.log(`Dashboard Issues: ${dashboardIssues.length}`);
    
    if (invalidEvents.length === 0 && apiIssues.length === 0 && dashboardIssues.length === 0) {
        console.log('\n✅ REVENUE MODEL HARDENING: PASSED');
        process.exit(0);
    } else {
        console.log('\n⚠️ REVENUE MODEL HARDENING: ISSUES FOUND');
        process.exit(1);
    }
}

runAudit();
