import React, { useState } from 'react';
import { useWalletState } from '../hooks/useWalletState';

export const WalletCard: React.FC = () => {
  const {
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
  } = useWalletState();
  const [importSeedPhrase, setImportSeedPhrase] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [error, setError] = useState('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage(`${type} copied!`);
    setTimeout(() => setCopyMessage(''), 2000);
  };

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setError('Are You retarded?');
    } else {
      setError('');
      setAmountInSOL(value);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto relative">
      {copyMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
          {copyMessage}
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-4">Solana Wallet</h2>
      
      {!publicKey ? (
        <div>
          <button
            onClick={createWallet}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            Create New Wallet
          </button>
          <div>
            <input
              type="text"
              value={importSeedPhrase}
              onChange={(e) => setImportSeedPhrase(e.target.value)}
              placeholder="Enter seed phrase to import"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={() => importWallet(importSeedPhrase)}
              disabled={isLoading || !importSeedPhrase}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Import Wallet
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex justify-between items-center">
            <strong>Public Key:</strong>
            <button onClick={() => publicKey && copyToClipboard(publicKey, 'Public key')} className="text-blue-500">Copy</button>
          </div>
          <p className="bg-gray-100 p-2 rounded mb-4 break-all">{publicKey && truncateString(publicKey, 20)}</p>

          <div className="mb-2 flex justify-between items-center">
            <strong>Private Key:</strong>
            <div>
              <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="text-blue-500 mr-2">
                {showPrivateKey ? 'Hide' : 'Show'}
              </button>
              {showPrivateKey && privateKey && (
                <button onClick={() => copyToClipboard(privateKey, 'Private key')} className="text-blue-500">Copy</button>
              )}
            </div>
          </div>
          {showPrivateKey && privateKey && (
            <p className="bg-gray-100 p-2 rounded mb-4 break-all">{truncateString(privateKey, 20)}</p>
          )}

          <div className="mb-4">
            <strong>Balance:</strong> {balance} SOL
            <button
              onClick={requestAirdrop}
              disabled={isLoading}
              className="ml-2 bg-yellow-500 text-white p-2 rounded"
            >
              Request Airdrop
            </button>
          </div>

          {seedPhrase && (
            <div>
              <div className="mb-2 flex justify-between items-center">
                <strong>Seed Phrase:</strong>
                <div>
                  <button onClick={() => setShowSeedPhrase(!showSeedPhrase)} className="text-blue-500 mr-2">
                    {showSeedPhrase ? 'Hide' : 'Show'}
                  </button>
                  {showSeedPhrase && (
                    <button onClick={() => copyToClipboard(seedPhrase, 'Seed phrase')} className="text-blue-500">Copy</button>
                  )}
                </div>
              </div>
              {showSeedPhrase && (
                <p className="bg-gray-100 p-2 rounded mb-4 break-all">{seedPhrase}</p>
              )}
            </div>
          )}

          <div className="mt-4">
            <input
              type="text"
              placeholder="Receiver Address"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="number"
              placeholder="Amount in SOL"
              value={amountInSOL}
              onChange={handleAmountChange}
              className={`border p-2 w-full mt-2 ${error ? 'border-red-500' : ''}`}
            />
            {error && (
              <p className="text-red-500 mt-1">{error}</p>
            )}
            <button
              onClick={sendSol}
              disabled={isLoading || !receiverAddress || amountInSOL <= 0}
              className="bg-green-500 text-white p-2 rounded mt-2"
            >
              Send SOL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
