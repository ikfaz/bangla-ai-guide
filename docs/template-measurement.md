# Template download measurement

The small-shop guide has two ordinary download links. They work without analytics
consent and without JavaScript. Optional measurement records link activation,
not download completion, a saved file, a unique reader, or a business outcome.

Event: `template_download_click`.

| resource_id | Resource |
| --- | --- |
| shop-calendar-csv | Seven-day editable shop calendar |
| shop-prompts-txt | Bengali shop prompts |

`js/analytics.js` recognizes only the two exact same-origin download paths.
Left clicks (including keyboard activation) and middle clicks are counted.
Cancelled clicks, right clicks, unknown paths, external URLs, and links with
queries or fragments are ignored. No link text or destination URL is sent.
Page location excludes queries/fragments; referrer is reduced to its origin.

The event requires explicit analytics acceptance and a loaded/configured
analytics script. Refused, pre-consent, pre-load, and revoked-consent clicks are
discarded, never buffered or replayed. Blocked analytics and refusals therefore
mean counts cannot represent all downloads. Repeat clicks can count repeatedly.

Validation: `node scripts/test-consent-analytics.cjs` exercises these boundaries
offline. It checks event enqueueing, not delivery to Google Analytics. The
property's configuration and Enhanced Measurement settings are not verified;
its automatic events may differ from this custom event. No conversion or
completed-download metric is configured by this change.

When the owner provides analytics access or an export, inspect this event and
its resource IDs before using it for decisions. Compare which resources receive
clicks among consenting readers; do not infer traffic, successful downloads,
subscriber growth or revenue from these counts alone.

The post planner adds two consent-gated events on `/post-planner/`.
`post_plan_create` fires after the reader makes a plan from the form.
`post_plan_csv_click` fires when the browser starts the CSV handoff and
includes only the fixed `variant` value `example` or `custom`. Neither event
includes the product, audience, shop facts, plan, or prompt. The download
event does not confirm that a file was saved.
