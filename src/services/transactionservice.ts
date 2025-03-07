import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { walletService } from './walletService';

const connection = walletService.connection;

export const sendTransaction = async (
  senderPublicKey: string,
  receiverAddress: string,
  amountInSOL: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
) => {
  try {
    const receiverPublicKey = new PublicKey(receiverAddress);
    const blockhashResponse = await connection.getLatestBlockhash('finalized');
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(senderPublicKey),
        toPubkey: receiverPublicKey,
        lamports: Math.floor(amountInSOL * 1e9), // Convert SOL to lamports
      })
    );
    transaction.recentBlockhash = blockhashResponse.blockhash;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature);

    console.log(`Transaction successful! Signature: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    return null;
  }
};
