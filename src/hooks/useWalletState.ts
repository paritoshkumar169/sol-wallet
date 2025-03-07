import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { sendTransaction } from '../services/transactionservice';
import { Keypair } from '@solana/web3.js';
export function useWalletState() {
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amountInSOL, setAmountInSOL] = useState(0);

  useEffect(() => {
    const storedSeedPhrase = localStorage.getItem('seedPhrase');
    const storedPublicKey = localStorage.getItem('publicKey');
    const storedPrivateKey = localStorage.getItem('privateKey');

    if (storedSeedPhrase && storedPublicKey && storedPrivateKey) {
      setSeedPhrase(storedSeedPhrase);
      setPublicKey(storedPublicKey);
      setPrivateKey(storedPrivateKey);
      walletService.getBalance(storedPublicKey).then((balance) => setBalance(balance));
    }
  }, []);

  const createWallet = async () => {
    setIsLoading(true);
    try {
      const { seedPhrase, publicKey, privateKey } = await walletService.createWallet();
      setSeedPhrase(seedPhrase);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      localStorage.setItem('seedPhrase', seedPhrase);
      localStorage.setItem('publicKey', publicKey);
      localStorage.setItem('privateKey', privateKey);
      const balance = await walletService.getBalance(publicKey);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const importWallet = async (importedSeedPhrase: string) => {
    setIsLoading(true);
    try {
      const { publicKey, privateKey } = await walletService.importWallet(importedSeedPhrase);
      setSeedPhrase(importedSeedPhrase);
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      localStorage.setItem('seedPhrase', importedSeedPhrase);
      localStorage.setItem('publicKey', publicKey);
      localStorage.setItem('privateKey', privateKey);
      const balance = await walletService.getBalance(publicKey);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to import wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestAirdrop = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const success = await walletService.requestAirdrop(publicKey);
      if (success) {
        const newBalance = await walletService.getBalance(publicKey);
        setBalance(newBalance);
      }
    } catch (error) {
      console.error('Failed to request airdrop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSol = async () => {
    if (!publicKey || !privateKey) return;
    setIsLoading(true);
    try {
      const signature = await sendTransaction(
        publicKey,
        receiverAddress,
        amountInSOL,
        async (transaction) => {
          if (!privateKey) throw new Error('Private key is missing');

          const privateKeyBuffer = Buffer.from(privateKey, 'hex');
          const privateKeyUint8Array = new Uint8Array(privateKeyBuffer);
          const keypair = Keypair.fromSecretKey(privateKeyUint8Array);
          transaction.partialSign(keypair);
          return transaction;
        }
      );
      if (signature) {
        const newBalance = await walletService.getBalance(publicKey);
        setBalance(newBalance);
      }
    } catch (error) {
      console.error('Error sending SOL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    seedPhrase,
    publicKey,
    privateKey,
    balance,
    isLoading,
    createWallet,
    importWallet,
    requestAirdrop,
    sendSol,
    receiverAddress,
    setReceiverAddress,
    amountInSOL,
    setAmountInSOL,
  };
}
