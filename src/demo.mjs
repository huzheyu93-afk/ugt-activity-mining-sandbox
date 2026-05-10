#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const EVENT_WEIGHTS = {
  wallet_login: 8,
  game_session_completed: 18,
  marketplace_order: 20,
  nft_check: 12,
  developer_api_test: 18,
  tutorial_contribution: 14,
  partner_quest_completed: 16,
  quest_checkpoint_verified: 10,
};

const EVENT_TYPE_CAPS = {
  wallet_login: 1,
  game_session_completed: 3,
  marketplace_order: 3,
  nft_check: 2,
  developer_api_test: 3,
  tutorial_contribution: 2,
  partner_quest_completed: 3,
  quest_checkpoint_verified: 2,
};

function readPayload(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
}

function assertString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required`);
  }
}

function assertConfidence(value, field) {
  const confidence = Number(value);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error(`${field} must be between 0 and 1`);
  }
}

function validateEvent(event, index) {
  assertString(event.eventId, `events[${index}].eventId`);
  assertString(event.type, `events[${index}].type`);
  assertString(event.occurredAt, `events[${index}].occurredAt`);
  assertString(event.source, `events[${index}].source`);
  if (Number.isNaN(Date.parse(event.occurredAt))) {
    throw new Error(`events[${index}].occurredAt must be an ISO date`);
  }
  if (event.confidence !== undefined) {
    assertConfidence(event.confidence, `events[${index}].confidence`);
  }
}

function validatePayload(payload) {
  assertString(payload.campaignId, 'campaignId');
  assertString(payload.accountId, 'accountId');
  if (!Array.isArray(payload.events) || payload.events.length === 0) {
    throw new Error('events must be a non-empty array');
  }
  payload.events.forEach(validateEvent);
}

function statusForScore(score, warnings) {
  if (warnings.some((warning) => warning.startsWith('duplicate_event'))) return 'review_required';
  if (score >= 80) return 'ecosystem_contributor';
  if (score >= 50) return 'active_participant';
  if (score >= 25) return 'starter';
  return 'needs_more_activity';
}

function scoreActivity(payload) {
  validatePayload(payload);

  const seenEvents = new Set();
  const typeCounts = new Map();
  const distinctTypes = new Set();
  const matchedRules = new Set();
  const signals = [];
  const warnings = [];
  let acceptedEvents = 0;
  let score = 0;

  payload.events.forEach((event) => {
    if (seenEvents.has(event.eventId)) {
      warnings.push(`duplicate_event:${event.eventId}`);
      return;
    }
    seenEvents.add(event.eventId);

    const baseWeight = EVENT_WEIGHTS[event.type];
    if (!baseWeight) {
      warnings.push(`unsupported_event_type:${event.type}`);
      return;
    }

    const nextCount = (typeCounts.get(event.type) || 0) + 1;
    typeCounts.set(event.type, nextCount);
    if (nextCount > EVENT_TYPE_CAPS[event.type]) {
      warnings.push(`event_type_cap_reached:${event.type}`);
      return;
    }

    const confidence = Number(event.confidence ?? 0.75);
    if (confidence < 0.7) {
      warnings.push(`low_confidence_event:${event.eventId}`);
      return;
    }

    distinctTypes.add(event.type);
    if (event.ruleId) matchedRules.add(event.ruleId);

    const confidenceMultiplier = confidence >= 0.9 ? 1 : 0.75;
    score += Math.round(baseWeight * confidenceMultiplier);
    acceptedEvents += 1;
    signals.push(`${event.type}:${event.source}`);
  });

  if (distinctTypes.size >= 4) {
    score += 12;
    signals.push('multi_surface_activity');
  }

  if (
    distinctTypes.has('game_session_completed') &&
    distinctTypes.has('marketplace_order') &&
    distinctTypes.has('developer_api_test')
  ) {
    score += 8;
    signals.push('game_marketplace_builder_loop');
  }

  if (matchedRules.size >= 4) {
    score += 6;
    signals.push('published_rules_matched');
  }

  const contributionScore = Math.min(score, 100);
  const contributionHash = crypto
    .createHash('sha256')
    .update(`${payload.campaignId}:${payload.accountId}:${seenEvents.size}`)
    .digest('hex')
    .slice(0, 12);

  return {
    contributionId: `demo-ugt-activity-${contributionHash}`,
    campaignId: payload.campaignId,
    accountId: payload.accountId,
    status: statusForScore(contributionScore, warnings),
    contributionScore,
    acceptedEvents,
    distinctEventTypes: Array.from(distinctTypes).sort(),
    matchedRules: Array.from(matchedRules).sort(),
    signals,
    warnings,
    ctaUrl:
      'https://www.binergy.io/ugt-ecosystem-mining?utm_source=github&utm_medium=oss&utm_campaign=ugt_activity_mining_sandbox',
    riskNote:
      'Demo scoring only. This does not award tokens, guarantee rewards, calculate ROI, or connect to production APIs.',
  };
}

function main() {
  const filePath = process.argv[2] || 'examples/activity-events.json';
  const payload = readPayload(filePath);
  const result = scoreActivity(payload);
  console.log(JSON.stringify(result, null, 2));
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main();
}

export { scoreActivity, validatePayload, validateEvent };
