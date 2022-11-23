// this should only be defined when working locally.
if (process.env.API_URL) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

// a bit of a hack until we only support ES Modules.
// at least this is the officially recommended hack
// https://github.com/node-fetch/node-fetch#commonjs
// note the key here:
// https://github.com/microsoft/TypeScript/pull/44501#issue-914346744
const fetch = (...args) =>
  import('node-fetch').then(({ default: module }) => module(...args));

export default fetch;
