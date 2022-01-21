const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const transferSOL = async (from, to, transferAmt) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(from.publicKey),
        toPubkey: new PublicKey(to.publicKey),
        lamports: transferAmt * LAMPORTS_PER_SOL,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    return signature;
  } catch (err) {
    console.log("Error in transferSOL");
    console.log(err);
  }
};

const getWalletBalance = async (pubk) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const balance = await connection.getBalance(new PublicKey(pubk));
    console.log(`-- Wallet Balance: ${balance / LAMPORTS_PER_SOL} SOL --`);
    return balance / LAMPORTS_PER_SOL;
  } catch (err) {
    console.log(err);
  }
};

const airDropSol = async (pubk, solCount) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log(`-- Airdropping ${solCount} SOL --`);
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(pubk),
      solCount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  transferSOL,
  getWalletBalance,
  airDropSol,
};
