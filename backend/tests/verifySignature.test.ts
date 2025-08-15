import request from 'supertest';
import { Wallet } from 'ethers';
import { createApp } from '../src/app';

describe('POST /verify-signature', () => {
  const app = createApp();

  it('verifies a correct signature', async () => {
    const wallet = Wallet.createRandom();
    const message = 'hello web3';
    const signature = await wallet.signMessage(message);

    const res = await request(app)
      .post('/verify-signature')
      .send({ message, signature })
      .expect(200);

    expect(res.body.isValid).toBe(true);
    expect(res.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(res.body.originalMessage).toBe(message);
  });

  it('recovers a different signer when verifying a different message', async () => {
    const wallet = Wallet.createRandom();
    const msgA = 'A';
    const msgB = 'B';
    const signatureForA = await wallet.signMessage(msgA);

    const res = await request(app)
      .post('/verify-signature')
      .send({ message: msgB, signature: signatureForA })
      .expect(200);

    expect(res.body.isValid).toBe(true);
    expect(res.body.signer.toLowerCase()).not.toBe(wallet.address.toLowerCase());
    expect(res.body.originalMessage).toBe(msgB);
  });

  it('400 on invalid input (schema validation)', async () => {
    const res = await request(app)
      .post('/verify-signature')
      .send({ message: '', signature: 'oops' })
      .expect(400);

    expect(res.body.isValid).toBe(false);
  });
});
