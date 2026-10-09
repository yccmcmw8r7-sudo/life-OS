import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, messages } from './messages.js';
import { LOCALE_TAGS, formatLocalizedDate, formatLocalizedNumber, formatLocalizedPercent, isRTL, localeTag } from './locale.js';

test('all selectable languages have unique codes, translations and locale tags', () => {
  const codes = LANGUAGES.map((language) => language.code);
  assert.equal(new Set(codes).size, codes.length, 'language codes must be unique');
  assert.equal(codes.length, 20, 'the supported-language count changed; update product copy and QA');
  for (const code of codes) {
    assert.ok(messages[code], `missing message catalogue for ${code}`);
    assert.ok(LOCALE_TAGS[code], `missing locale tag for ${code}`);
    assert.doesNotThrow(() => new Intl.DateTimeFormat(localeTag(code)));
    assert.doesNotThrow(() => new Intl.NumberFormat(localeTag(code)));
  }
  assert.deepEqual(Object.keys(LOCALE_TAGS).sort(), [...codes].sort());
});

test('right-to-left classification is explicit and limited to supported RTL languages', () => {
  assert.equal(isRTL('ar'), true);
  assert.equal(isRTL('ur'), true);
  assert.equal(isRTL('pt'), false);
  assert.equal(isRTL('en'), false);
});

test('localized formatters handle dates, numbers and percentages safely', () => {
  assert.equal(formatLocalizedDate('not-a-date', 'pt'), '');
  assert.notEqual(formatLocalizedDate('2026-10-09T12:00:00Z', 'pt'), '');
  assert.equal(formatLocalizedNumber(1234.5, 'en', 1), '1,234.5');
  assert.equal(formatLocalizedPercent(0.25, 'en'), '25%');
  assert.notEqual(formatLocalizedNumber(1234.5, 'de', 1), '1,234.5');
});
