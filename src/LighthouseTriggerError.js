export default class LighthouseTriggerError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, LighthouseTriggerError);

    const [, options] = args;
    this.code = options.code;
    this.data = options.data;
  }
}
