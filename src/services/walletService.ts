import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl, SolanaJSONRPCError } from '@solana/web3.js';
import * as bip39 from 'bip39';

const NETWORK = 'API_KEY';

export class WalletService {
  public connection: Connection;

  constructor() {
    this.connection = new Connection(NETWORK);
  }
  async requestAirdrop(publicKey: string): Promise<boolean> {
    try {
      const airdropAmount = 0.1 * LAMPORTS_PER_SOL; // Request 0.1 SOL
      const signature = await this.connection.requestAirdrop(
        new PublicKey(publicKey),
        airdropAmount
      );
      await this.connection.confirmTransaction(signature);
      return true;
    } catch (error) {
      console.error('Airdrop failed:', error);
      return false;
    }
  }
  
  async createWallet(): Promise<{ seedPhrase: string; publicKey: string; privateKey: string }> {
    const seedPhrase = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    return {
      seedPhrase,
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex')
    };
  }

  async importWallet(seedPhrase: string): Promise<{ publicKey: string; privateKey: string }> {
    const seed = await bip39.mnemonicToSeed(seedPhrase);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));
    return {
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex')
    };
  }

  async getBalance(publicKey: string): Promise<number> {
    const balance = await this.connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
  }

  
}

export const walletService = new WalletService();
