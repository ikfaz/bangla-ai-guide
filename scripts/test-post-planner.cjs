const assert = require('node:assert/strict');
const { makePlan, toCsv } = require('../js/post-planner.js');

for (const frequency of [3, 5, 7]) {
  const plan = makePlan({ product: 'সুতি ব্যাগ', audience: 'বাজারের ক্রেতা', frequency, facts: 'রং প্রাকৃতিক সাদা' });
  assert.equal(new Set(plan.days.map(day => day.day)).size, 7);
  assert.equal(plan.days.filter(day => day.photo).length, frequency);
  assert.equal(plan.days.filter(day => !day.photo).length, 7 - frequency);
  assert.ok(plan.prompt.includes('পণ্য বা সেবা: সুতি ব্যাগ'));
  assert.ok(plan.prompt.includes('পাঠক: বাজারের ক্রেতা'));
  assert.ok(plan.prompt.includes('যাচাই করা তথ্য: রং প্রাকৃতিক সাদা'));
  assert.ok(plan.prompt.includes('বানিয়ে লিখবে না'));
  assert.equal(toCsv(plan).trimEnd().split('\r\n').length, 8);
}

assert.throws(() => makePlan({ product: ' \n ', frequency: 3 }), /required/);
assert.throws(() => makePlan({ product: 'সুতি ব্যাগ', frequency: 4 }), /required/);

const csv = toCsv(makePlan({
  product: '  =HYPERLINK("https://example.test","নমুনা")',
  audience: 'ক, "খ"',
  facts: '@নমুনা',
  frequency: 3,
}));
assert.equal(csv.charCodeAt(0), 0xfeff, 'Include a UTF-8 BOM for Bengali spreadsheet imports');
assert.ok(csv.includes('"\'=HYPERLINK(""https://example.test"",""নমুনা"")"'));
assert.ok(csv.includes('"ক, ""খ"""'), 'Quote separators and embedded quotes');
assert.ok(csv.includes('"\'@নমুনা"'));
console.log('Planner schedules, Bangla prompts, CSV encoding, and spreadsheet-safe cells passed.');
