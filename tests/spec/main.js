var SDK = require('streamhub-sdk');

describe('streamhub-sdk', function () {
  it('exposes things on its main export namespace obj', function () {
    expect(typeof SDK.LivefyreHttpClient).toBe('function');
    expect(typeof SDK.StateToContent).toBe('function');
  });
});
