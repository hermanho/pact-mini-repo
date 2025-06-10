import { describe, it } from '@jest/globals';
import { Verifier } from '@pact-foundation/pact';

describe('Pact Verification', () => {
  it('feat1 hello', async () => {
    const options = {
      providerBaseUrl: 'http://127.0.0.1:3000',
      provider: 'feat1 provider',
      providerVersion: '1.0.0',
      publishVerificationResults: true,
      pactBrokerUrl: 'http://127.0.0.1:9292',
      consumerVersionSelectors: [
        {
          latest: true,
        },
      ],
    };
    const verifyResult = await new Verifier(options).verifyProvider();
    return verifyResult;
  }, 30000);
});
