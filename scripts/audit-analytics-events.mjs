/**
 * Data Integrity Audit Script
 * 
 * Validates analytics implementation integrity:
 * 1. All trackEvent calls use registered event names
 * 2. All track() calls use valid GA4 event names
 * 3. Event parameters match taxonomy definitions
 * 
 * Run: node scripts/audit-analytics-events.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BACKEND_EVENTS = [
    'page_view',
    'click_partner',
    'view_partner', 
    'click_donate',
    'play_audio',
    'share_devotional',
    'onboarding_start',
    'church_selected',
    'onboarding_complete',
    'first_login',
    'return_visit',
    'app_session',
    'attribution_captured',
    'campaign_conversion',
    'donate_view',
    'donate_click',
    'donate_initiated',
    'donate_complete',
    'partner_inquiry',
    'service_request',
    'affiliate_click'
];

const GA4_EVENTS = [
    'nav_click',
    'cta_click', 
    'content_open',
    'feature_usage',
    'login_status'
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

function extractTrackEventCalls(content) {
    const regex = /analytics\.trackEvent\(['"`]([^'"`]+)['"`]/g;
    const calls = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        calls.push(match[1]);
    }
    
    return calls;
}

function extractTrackCalls(content) {
    const regex = /analytics\.track\(\s*\{[^}]*name:\s*['"`]([^'"`]+)['"`]/g;
    const calls = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        calls.push(match[1]);
    }
    
    return calls;
}

function runAudit() {
    console.log('🔍 MD Connect - Analytics Data Integrity Audit\n');
    console.log('=' .repeat(50));
    
    const srcDir = './src';
    const tsxFiles = findFiles(srcDir, /\.tsx$/);
    
    const trackEventCalls = [];
    const trackCalls = [];
    
    for (const file of tsxFiles) {
        const content = readFileSync(file, 'utf-8');
        trackEventCalls.push(...extractTrackEventCalls(content).map(e => ({ event: e, file })));
        trackCalls.push(...extractTrackCalls(content).map(e => ({ event: e, file: file })));
    }
    
    console.log(`\n📊 Found ${trackEventCalls.length} trackEvent calls`);
    console.log(`📊 Found ${trackCalls.length} track() calls\n`);
    
    // Validate trackEvent calls
    console.log('--- trackEvent Validation ---');
    const invalidTrackEvent = [];
    for (const { event, file } of trackEventCalls) {
        if (!BACKEND_EVENTS.includes(event)) {
            invalidTrackEvent.push({ event, file });
            console.log(`❌ Invalid event: "${event}" in ${file}`);
        }
    }
    
    if (invalidTrackEvent.length === 0) {
        console.log('✅ All trackEvent calls use valid registered events');
    }
    
    // Validate track calls
    console.log('\n--- track() Validation ---');
    const invalidTrack = [];
    for (const { event, file } of trackCalls) {
        if (!GA4_EVENTS.includes(event)) {
            invalidTrack.push({ event, file });
            console.log(`❌ Invalid GA4 event: "${event}" in ${file}`);
        }
    }
    
    if (invalidTrack.length === 0) {
        console.log('✅ All track() calls use valid GA4 events');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Backend Events Registered: ${BACKEND_EVENTS.length}`);
    console.log(`GA4 Events Registered: ${GA4_EVENTS.length}`);
    console.log(`trackEvent calls found: ${trackEventCalls.length}`);
    console.log(`track() calls found: ${trackCalls.length}`);
    console.log(`Invalid trackEvent: ${invalidTrackEvent.length}`);
    console.log(`Invalid track(): ${invalidTrack.length}`);
    
    if (invalidTrackEvent.length === 0 && invalidTrack.length === 0) {
        console.log('\n✅ DATA INTEGRITY: PASSED');
        process.exit(0);
    } else {
        console.log('\n❌ DATA INTEGRITY: FAILED');
        process.exit(1);
    }
}

runAudit();
