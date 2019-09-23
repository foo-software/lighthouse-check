[![CircleCI](https://circleci.com/gh/foo-software/lighthouse-check.svg?style=svg)](https://circleci.com/gh/foo-software/lighthouse-check)

# `@foo-software/lighthouse-check`

> An NPM module and CLI to run Lighthouse audits programatically. This project aims to extend base functionality of simply running an audit by providing bells and whistles for DevOps workflows. Easily implement in your Continuous Integration or Continuous Delivery pipeline.

<img src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-audit-report.png" />

## Features

- Simple usage with one paramater (`urls`). If you don't need all the bells and whistles this will suffice!
- Run multiple Lighthouse audits with one command (specify multiple URLs... or just one).
- Optionally save an HTML report locally.
- Optionally save an HTML report in an AWS S3 bucket.
- Easy setup with Slack Webhooks. Just add your Webhook URL and `lighthouse-check` will send results with details about authors and links to change sets if applicable (on GitHub).
- A CLI - see [usage](#cli-usage).
- A Docker image - see [usage](#docker-usage).

## Install

```bash
npm install @foo-software/lighthouse-check
```

or

```bash
yarn add @foo-software/lighthouse-check
```

## Usage

Calling `lighthouseCheck` will run Lighthouse audits against `https://www.foo.software` and `https://www.foo.software/contact`.

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    urls: [
      'https://www.foo.software',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

## Options

`lighthouseCheck` accepts a single configuration object with the below properties.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <!--
    <tr>
      <td><code>apiToken</code></td>
      <td>The lighthouse-check account API token found in the dashboard.</td>
      <td><code>string</code></td>
      <td><code>undefined</code></td>
      <td>yes</td>
    </tr>
  -->
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>branch</code></td>
    <td>For Slack notifications: A version control branch, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsAccessKeyId</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsBucket</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsRegion</code></td>
    <td>The AWS <code>region</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsSecretAccessKey</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop']</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>locale</code></td>
    <td>A locale for Lighthouse reports. Example: <code>ja</code></td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. You can do this an an alternative or combined with an S3 upload.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>pr</code></td>
    <td>For Slack notifications: A version control pull request URL, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>slackWebhookUrl</code></td>
    <td>A Slack Incoming Webhook URL to send notifications to.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>sha</code></td>
    <td>For Slack notifications: A version control <code>sha</code>, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G'])</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>timeout</code></td>
    <td>Minutes to timeout. If <code>wait</code> is <code>true</code> (it is by default), we wait for results. If this timeout is reached before results are received an error is thrown.</td>
    <td><code>number</code></td>
    <td><code>10</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>An optional list of URLs represented by their respective API token. URL API tokens can be found in the dashboard.</td>
    <td><code>array</code></td>
    <td><code>undefined</code></td>
    <td>yes</td>
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

## CLI Usage

Running `lighthouse-check` in the example below will run Lighthouse audits against `https://www.foo.software` and `https://www.foo.software/contact`.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact"
```

## CLI Options

All options mirror [the NPM module](#options). The only difference is that array options like `urls` are passed in as a comma-separated string as an argument using the CLI.

## Docker Usage

```bash
$ docker pull foosoftware/lighthouse-check:latest
$ docker run foosoftware/lighthouse-check:latest \
  lighthouse-check --verbose \
  --urls "https://www.foo.software,https://www.foo.software/contact"
```

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
