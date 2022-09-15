const anchor = require("@project-serum/anchor");
const { expect } = require("chai");

describe("sol-practice", async () => {
  let counterAccount;

  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter;

  beforeEach(async () => {
    counterAccount = anchor.web3.Keypair.generate();
    await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterAccount])
      .rpc();
  });

  it("..should verify the deployment value", async () => {
    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );
    expect(counter.count).to.equal(0);
  });

  it(".. should test increment function", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );
    expect(counter.count).to.equal(1);
  });

  it(".. should test decrement function", async () => {
    await program.methods
      .decrement()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    expect(counter.count).to.equal(-1);
  });

  it(".. should test reset function", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    let counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count).to.equal(3);

    // incremented 3 times and now resetting
    await program.methods
      .reset()
      .accounts({
        counter: counterAccount.publicKey,
        caller: provider.wallet.publicKey,
      })
      .rpc();

    counter = await program.account.counter.fetch(counterAccount.publicKey);
    expect(counter.count).to.equal(0);
  });
});
