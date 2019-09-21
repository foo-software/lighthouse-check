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

`lighthouseCheck` accepts a single configuration object with the below properties we can think of as parameters.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>apiToken</code></td>
    <td>The lighthouse-check account API token found in the dashboard.</td>
    <td><code>string</code></td>
    <td><code>--</code></td>
    <td>yes</td>
  </tr>
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>An optional list of URLs represented by their respective API token. URL API tokens can be found in the dashboard.</td>
    <td><code>array</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>verbose</code></td>
    <td>If <code>true</code>, print out steps and results to the console.</td>
    <td><code>boolean</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>wait</code></td>
    <td>If <code>true</code>, waits for all audit results to be returned, otherwise URLs are only enqueued.</td>
    <td><code>boolean</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>timeout</code></td>
    <td>Minutes to timeout. If <code>wait</code> is <code>true</code> (it is by default), we wait for results. If this timeout is reached before results are received an error is thrown.</td>
    <td><code>number</code></td>
    <td><code>10</code></td>
    <td>no</td>
  </tr>
</table>

## Return Payload

`lighthouseCheck()` function returns a promise which either resolves as an object or rejects as an error object. In both cases the payload will be of the same shape documented below.

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
    <td><code>message</code></td>
    <td>A message to elaborate on the code. This field isn't always populated.</td>
    <td><code>string</code></td>
  </tr>
</table>

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
