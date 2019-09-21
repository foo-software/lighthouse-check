## Disclaimer

This project is a work in progress - a pre-release version. Please do not attempt to use yet. The projected release date is middle of October, 2019.

***

[![CircleCI](https://circleci.com/gh/foo-software/lighthouse-check.svg?style=svg)](https://circleci.com/gh/foo-software/lighthouse-check)

# `@foo-software/lighthouse-check`

> An NPM module to trigger Lighthouse audits to be saved in the cloud. Triggers audits for URLs associated with a lighthouse-check.com account. Utilizing this module within a release or integration workflow would be a standard use case.

<img src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-audit-report.png" />

## Install

```bash
npm install @foo-software/lighthouse-check
```

or

```bash
yarn add @foo-software/lighthouse-check
```

## Usage

Calling `lighthouseCheck` in the example below will trigger Lighthouse audits for all URLs associated with the account having an API token of `abc123`.

```javascript
const { lighthouseCheck } = require('@foo-software/lighthouse-check');

const init = async () => {
  const response = await lighthouseCheck ({
    apiToken: 'abc123'
  });

  console.log('response', response);
};

init();
```

To run Lighthouse audits on a subset of URLs, you can specify an array of URLs denoted by their respective API tokens. Example below.

```javascript
lighthouseCheck({
  apiToken: 'abc123',
  urls: ['cde456', 'fgh789']
});
```

## Parameters

`lighthouseTrigger` accepts a single configuration object with the below properties we can think of as parameters.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>apiToken</code></td>
    <td>The lighthouse-check account API token found in the dashboard.</td>
    <td><code>string</code></td>
    <td>yes</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>An optional list of URLs represented by their respective API token. URL API tokens can be found in the dashboard.</td>
    <td><code>array</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td>no</td>
  </tr>
</table>

## Return Payload

It's important to note that `lighthouseTrigger()` function is encapsulated by a try / catch, so an object should always be returned. Errors are caught, but populated in the return object below.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
  </tr>
  <tr>
    <td><code>code</code></td>
    <td>A code to signify failure or succes.</td>
    <td><code>oneOf(["SUCCESS", "ERROR_GENERIC", ...])</code> see <a href="src/errorCodes.js">errorCodes.js</a> for all error codes.</td>
  </tr>
  <tr>
    <td><code>data</code></td>
    <td>An array of results returned by the API.</td>
    <td><code>array</code></td>
  </tr>
  <tr>
    <td><code>error</code></td>
    <td>If there was a problem, this property will typically be populated with an error object. This field is only populated when an error was caught or the params didn't pass validation.</td>
    <td><code>object</code> (typically an error object)</td>
  </tr>
  <tr>
    <td><code>message</code></td>
    <td>A message to elaborate on the code. This field isn't always populated.</td>
    <td><code>string</code></td>
  </tr>
</table>

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
