import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";

const CHAINLINK_FEED = "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6"
const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"

describe("chainlink_solana_dapp", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider);
    const program = anchor.workspace.ChainlinkSolanaDapp

  it("Queries SOL/USD price feed", async () => {
    const resultAccount = anchor.web3.Keypair.generate()
    await program.rpc.execute({
      accounts: {
        resultAccount: resultAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID
      },
      signers: [resultAccount]
    })
    const latestPrice = await program.account.resultAccount.fetch(resultAccount.publicKey)
    console.log("latestPrice in result account: ", latestPrice.value)
    console.log("Price is: ", latestPrice.value / 100000000)
  })
});
