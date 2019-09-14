## Disclaimer

This project is a work in progress - a pre-release version. Please do not attempt to use yet. The projected release date is middle of October, 2019.

***

# `@foo-software/lighthouse-trigger`

> An NPM module to trigger Lighthouse audits to be saved in the cloud. Triggers audits for URLs associated with a lighthouse-check.com account. Utilizing this module within a release or integration workflow would be a standard use case.

<img src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-audit-report.png" />

## Install

```bash
npm install @foo-software/lighthouse-trigger
```

or

```bash
yarn add @foo-software/lighthouse-trigger
```

## Usage

Calling `lighthouseTrigger` in the example below will trigger Lighthouse audits for all URLs associated with the account having an API key of `abc123`.

```javascript
const { lighthouseTrigger } = require('lighthouse-trigger');

const init = async () => {
  const response = await lighthouseTrigger({
    apiKey: 'abc123'
  });

  console.log('response', response);
};

init();
```

To run Lighthouse audits on a subset of URLs, you can specify an array of URLs denoted by their respective API keys. Example below.

```javascript
lighthouseTrigger({
  apiKey: 'abc123',
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
    <td><code>apiKey</code></td>
    <td>The lighthouse-check account API key found in the dashboard.</td>
    <td><code>string</code></td>
    <td>yes</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>An optional list of URLs represented by their respective API key. URL API keys can be found in the dashboard for a given URL.</td>
    <td><code>array</code></td>
    <td>no</td>
  </tr>
</table>

## Response Payload

Coming soon.

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
