import React, { useState, useEffect } from 'react';

// Utility to format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Main App component
function App() {
  // State for navigation (mimics bottom tab bar)
  const [activeTab, setActiveTab] = useState('wallet');

  // Constants for minimums (hardcoded, no external fetching)
  const BTC_GAS_FEE_REQUIRED = 0.001;
  const BTC_MIN_WITHDRAWAL = 0.1;
  const TRX_MIN_DEPOSIT = 100;
  const SOL_MIN_DEPOSIT = 1;
  const BNB_MIN_DEPOSIT = 0.25;
  const ETH_MIN_DEPOSIT = 0.05;

  // State for simulated wallet assets (initial balances are hardcoded)
  const [assets, setAssets] = useState([
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: 0.53456, // Initial BTC balance
      usdPrice: 101713,
      icon: 'https://assets.trustwalletapp.com/blockchains/bitcoin/info/logo.png'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 0, // Initial ETH balance
      usdPrice: 2272,
      icon: 'https://assets.trustwalletapp.com/blockchains/ethereum/info/logo.png'
    },
    {
      id: 'trx',
      name: 'TRON',
      symbol: 'TRX',
      balance: 0, // Initial TRX balance
      usdPrice: 0.27,
      icon: 'https://assets.trustwalletapp.com/blockchains/tron/info/logo.png'
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      balance: 0, // Initial SOL balance
      usdPrice: 150,
      icon: 'https://assets.trustwalletapp.com/blockchains/solana/info/logo.png'
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      balance: 0, // Initial BNB balance
      usdPrice: 600,
      icon: 'https://assets.trustwalletapp.com/blockchains/binance/info/logo.png'
    },
  ]);

  // Function to get the current balance for a given asset ID
  const getAssetBalance = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? asset.balance : 0;
  };

  // Function to update an asset's balance (for future features if needed)
  const updateAssetBalance = (assetId, newBalance) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === assetId ? { ...asset, balance: newBalance } : asset
      )
    );
  };

  // Calculate total portfolio value
  const totalPortfolioValue = assets.reduce((acc, asset) => {
    const currentBalance = getAssetBalance(asset.id);
    return acc + (currentBalance * asset.usdPrice);
  }, 0);

  // Sort assets for display: non-zero USD value first, then by symbol for others
  const sortedAssets = [...assets].sort((a, b) => {
    const aUsdValue = getAssetBalance(a.id) * a.usdPrice;
    const bUsdValue = getAssetBalance(b.id) * b.usdPrice;

    if (aUsdValue > 0 && bUsdValue === 0) return -1;
    if (aUsdValue === 0 && bUsdValue > 0) return 1;

    if (bUsdValue !== aUsdValue) {
      return bUsdValue - aUsdValue;
    }

    return a.symbol.localeCompare(b.symbol);
  });


  // --- Modal Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoinSelectionModalOpen, setIsCoinSelectionModalOpen] = useState(false); // For Receive
  const [isCoinSelectionForSendModalOpen, setIsCoinSelectionForSendModalOpen] = useState(false); // For Send
  const [modalType, setModalType] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const openModal = (type, coin) => {
    setModalType(type);
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedCoin(null);
  };

  const openCoinSelectionForReceive = () => {
    setIsCoinSelectionModalOpen(true);
  };

  const closeCoinSelectionModal = () => {
    setIsCoinSelectionModalOpen(false);
  };

  // Open coin selection modal for sending
  const openCoinSelectionForSend = () => {
    setIsCoinSelectionForSendModalOpen(true);
  };

  const closeCoinSelectionForSendModal = () => {
    setIsCoinSelectionForSendModalOpen(false);
  };

  // Handle 'Swap' action (removed button, just shows message)
  const handleSwap = () => {
    alert("This function is not available in your country.");
  };

  // Handle 'Receive' action after coin selection
  const handleReceive = () => {
    let depositMessage = "";
    if (selectedCoin.id === 'trx') {
        depositMessage = `Minimum deposit ${TRX_MIN_DEPOSIT} TRX. `;
    } else if (selectedCoin.id === 'sol') {
        depositMessage = `Minimum deposit ${SOL_MIN_DEPOSIT} SOL. `;
    } else if (selectedCoin.id === 'bnb') {
        depositMessage = `Minimum deposit ${BNB_MIN_DEPOSIT} BNB. `;
    } else if (selectedCoin.id === 'eth') {
        depositMessage = `Minimum deposit ${ETH_MIN_DEPOSIT} ETH. `;
    }

    alert(`${depositMessage}Share your wallet address for ${selectedCoin.symbol} to receive funds.`);
    closeModal();
    closeCoinSelectionModal();
  };

  // Handle generic 'Send' action (for non-BTC coins)
  const handleGenericSend = (sendAmount, recipientAddress) => {
    const amount = parseFloat(sendAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount for withdrawal.');
      return false;
    }

    const currentBalance = getAssetBalance(selectedCoin.id);
    if (amount > currentBalance) {
      alert(`Insufficient ${selectedCoin.symbol} balance. You have ${currentBalance.toFixed(4)} ${selectedCoin.symbol}.`);
      return false;
    }

    if (!recipientAddress || recipientAddress.trim() === '') {
        alert("Recipient address cannot be empty.");
        return false;
    }

    // In a real wallet, this would involve inputting recipient address and amount,
    // then signing and broadcasting a transaction.
    alert(`Proceeding to send ${amount.toFixed(4)} ${selectedCoin.symbol} to ${recipientAddress}. (Conceptual Send)`);
    // Optionally: update balance for other coins for simulation
    // updateAssetBalance(selectedCoin.id, currentBalance - amount);
    closeModal();
    return true;
  };

  // Handle 'Sell' action (now opens modal)
  const handleSell = () => {
    openModal('sell', null); // Open the ActionModal for 'sell' type
  };

  // Handle BTC Withdrawal logic (revised as per user request)
  // This is called from ActionModal's Confirm Send button for BTC
  const handleBtcWithdrawal = (withdrawalAmount, recipientAddress) => {
    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount for withdrawal.');
      return false;
    }

    // New: Minimum withdrawal amount for BTC
    if (amount < BTC_MIN_WITHDRAWAL) {
      alert(`Minimum withdrawal amount for BTC is ${BTC_MIN_WITHDRAWAL} BTC.`);
      return false;
    }

    if (amount > getAssetBalance('btc')) { // Use getAssetBalance for BTC too
      alert(`Insufficient BTC balance. You have ${getAssetBalance('btc').toFixed(8)} BTC.`);
      return false;
    }

    // Now, instead of immediately showing the deposit message,
    // we open a new modal type specifically for that prompt.
    openModal('deposit_fee_prompt', {
      symbol: 'BTC',
      amount: BTC_GAS_FEE_REQUIRED.toFixed(8)
    });
    // Do NOT close the original send modal here, as the prompt is a *step* in the process.
    // The prompt modal will overlay it. The user will close the deposit_fee_prompt modal.
    return true;
  };

  // Handle refreshing balances
  const handleRefresh = () => {
    alert("Balances refreshed!");
  };


  // Component for selecting a coin (reused for Send and Receive selection)
  const CoinSelectionModal = ({ isOpen, assets, onSelectCoin, onClose, title }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button onClick={onClose} className="modal-close-button">
            X
          </button>
          <h2 className="modal-title">{title}</h2>
          <div className="coin-selection-grid-container"> {/* New container for grid */}
            {assets.map(asset => (
              <button
                key={asset.id}
                onClick={() => onSelectCoin(asset)}
                className="coin-selection-grid-item"
              >
                <img src={asset.icon} alt={asset.name} className="coin-icon-small" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/555555/FFFFFF?text=?" }} />
                <p className="coin-name-small">{asset.name}</p>
                <p className="coin-symbol-small">{asset.symbol}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Component for the "Send", "Receive", and "Sell" modals, and the new deposit prompt
  const ActionModal = ({ isOpen, type, coin, onClose, assets, handleReceive, handleGenericSend, handleBtcWithdrawal }) => {
    const [withdrawalInput, setWithdrawalInput] = useState('');
    const [recipientAddressInput, setRecipientAddressInput] = useState('');
    const [addressError, setAddressError] = useState('');
    const [copySuccess, setCopySuccess] = useState(''); // New state for copy success message

    // Find BTC asset for fee prompt
    const btcAsset = assets.find(a => a.id === 'btc');
    const btcUsdPrice = btcAsset ? btcAsset.usdPrice : 0;

    useEffect(() => {
        // Reset inputs and errors when modal opens or coin changes
        if (isOpen) {
            setWithdrawalInput('');
            setRecipientAddressInput('');
            setAddressError('');
            setCopySuccess(''); // Reset copy message
        }
    }, [isOpen, coin]);


    if (!isOpen) return null;

    let modalTitle = "";
    let modalContent;

    const currentAmountUsd = parseFloat(withdrawalInput) * btcUsdPrice;

    // Simplified BTC address validation (for simulation purposes)
    const validateBtcAddress = (address) => {
        if (!address) {
            return "Address cannot be empty.";
        }
        // Basic check for common BTC address formats (starts with 1, 3, or bc1)
        // and a reasonable length. This is NOT exhaustive validation.
        const isValid = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(address);
        if (!isValid) {
            return "Invalid BTC address format. (e.g., must start with 1, 3, or bc1)";
        }
        return ""; // No error
    };

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textarea);
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    };


    if (type === 'receive') {
      modalTitle = `Receive ${coin?.symbol || ''}`;
      // Updated display addresses
      let displayAddress;
      if (coin?.id === 'btc') {
        displayAddress = 'bc1qhcyt4celqpws0xuer9n4e9llumdkmwc2j3yupn';
      } else if (coin?.id === 'eth' || coin?.id === 'bnb') {
        displayAddress = '0xEE5b5c157E05633a5c98779ca49154b62DA0220c';
      } else if (coin?.id === 'trx') {
        displayAddress = 'TKGe6kEi5r1BazZ1cNCvpTiK9cNqLVsmMu';
      } else if (coin?.id === 'sol') {
        displayAddress = 'N1hZcPhaQF1sSxAUGa4YkhqJh2n9NvBrbbTXyYZhL6F';
      } else {
        displayAddress = 'N/A';
      }

      modalContent = (
        <div>
          <p className="modal-text-description">
            Share this address to receive {coin?.symbol || ''}:
          </p>
          <div className="address-display">
            {displayAddress}
          </div>
          <p className="modal-text-small">
            A QR code would typically be displayed here for easy scanning.
          </p>
          <button
            onClick={() => copyToClipboard(displayAddress)}
            className="modal-action-button"
          >
            Copy Address
            {copySuccess && ` - ${copySuccess}`}
          </button>
        </div>
      );
    } else if (type === 'send') {
      modalTitle = `Send ${coin?.symbol || ''}`;
      modalContent = (
        <div>
          <p className="modal-text-description">
            Enter recipient address and amount to send {coin?.symbol || ''}.
          </p>
          {/* Current balance and Max button */}
          <div className="balance-info">
            <p className="balance-text">
              Your Current Balance: <span className="balance-value">
                {getAssetBalance(coin?.id).toFixed(coin?.id === 'btc' ? 8 : 4)} {coin?.symbol}
              </span>
            </p>
            {coin?.id === 'btc' && ( // "Max" button only for BTC
                <button
                    onClick={() => setWithdrawalInput(getAssetBalance('btc').toFixed(8))} // Max for BTC
                    className="max-button"
                >
                    MAX
                </button>
            )}
          </div>
          {/* Amount input */}
          <input
            type="number"
            placeholder="Amount"
            className="input-field"
            value={withdrawalInput}
            onChange={(e) => setWithdrawalInput(e.target.value)}
          />
          {coin?.id === 'btc' && withdrawalInput > 0 && ( // Display USD equivalent for BTC
            <p className="usd-equivalent-text">
              ~ {formatCurrency(currentAmountUsd)}
            </p>
          )}

          <input
            type="text"
            placeholder="Recipient Address"
            className="input-field"
            value={recipientAddressInput}
            onChange={(e) => {
                setRecipientAddressInput(e.target.value);
                if (coin?.id === 'btc') { // Only validate for BTC
                    setAddressError(validateBtcAddress(e.target.value));
                } else {
                    setAddressError(''); // Clear error for other coins
                }
            }}
          />
          {addressError && (
              <p className="error-message">{addressError}</p>
          )}


          <p className="modal-text-small">
            This transaction will require network confirmation.
          </p>
          <button
            onClick={() => {
                if (!recipientAddressInput || recipientAddressInput.trim() === '') {
                    setAddressError("Recipient address cannot be empty.");
                    return;
                }
                const amount = parseFloat(withdrawalInput);
                if (isNaN(amount) || amount <= 0) {
                    alert('Please enter a valid positive amount for withdrawal.');
                    return;
                }

                if (coin?.id === 'btc') {
                    const error = validateBtcAddress(recipientAddressInput);
                    if (error) {
                        setAddressError(error);
                        return;
                    }
                    handleBtcWithdrawal(withdrawalInput, recipientAddressInput);
                } else {
                    // For non-BTC coins, check if the amount is greater than the current balance
                    const currentBalance = getAssetBalance(coin?.id);
                    if (amount > currentBalance) {
                      alert(`Insufficient ${coin?.symbol} balance. You have ${currentBalance.toFixed(4)} ${coin?.symbol}.`);
                      return;
                    }
                    handleGenericSend(withdrawalInput, recipientAddressInput); // Pass amount and address
                }
            }}
            className="confirm-send-button"
          >
            Confirm Send
          </button>
        </div>
      );
    } else if (type === 'sell') {
        modalTitle = "Sell";
        modalContent = (
            <div className="text-center-container">
                <p className="modal-text-large">
                    Sell function is not supported in your country.
                </p>
                <button
                    onClick={onClose}
                    className="confirm-send-button"
                >
                    Close
                </button>
            </div>
        );
    } else if (type === 'deposit_fee_prompt') {
      modalTitle = "Withdrawal Information";
      modalContent = (
        <div className="text-center-container">
          <p className="modal-text-large">
            To complete this withdrawal, you need to deposit at least {coin?.amount} {coin?.symbol} to cover the transaction fee.
          </p>
          <p className="modal-text-medium">
            Please send {coin?.amount} {coin?.symbol} to your wallet address to proceed.
          </p>
          <button
            onClick={() => {
                onClose(); // Close this prompt modal
                openModal('receive', btcAsset); // Open receive modal for BTC
            }}
            className="deposit-fee-button"
          >
            Deposit BTC Fee
          </button>
          <button
            onClick={onClose}
            className="cancel-withdrawal-button"
          >
            Cancel Withdrawal
          </button>
        </div>
      );
    }


    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            X
          </button>
          <h2 className="modal-title">{modalTitle}</h2>
          {modalContent}
        </div>
      </div>
    );
  };

  // No loading screen since no async data fetching
  return (
    <div className="app-wrapper"> {/* New wrapper for max-width and centering */}
      <div className="app-container">
        {/* Embedded CSS for direct application */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

            body {
              margin: 0;
              font-family: 'Inter', sans-serif;
              background-color: #1a202c;
            }

            .app-wrapper {
                display: flex;
                justify-content: center;
                min-height: 100vh; /* Ensure it takes full viewport height */
                background-color: #1a202c; /* Background for the whole page */
            }

            .app-container {
              width: 100%;
              max-width: 450px; /* Constrain width for mini-app feel */
              background-color: #1a202c;
              display: flex;
              flex-direction: column;
              color: white;
              box-shadow: 0 0 15px rgba(0,0,0,0.5); /* Optional: add shadow to the mini-app area */
            }

            .header-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1rem;
              background-color: #2d3748; /* gray-800 */
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 10;
            }

            .header-title {
              font-size: 1.5rem; /* 2xl */
              font-weight: 700; /* bold */
              color: white;
              display: flex;
              align-items: center;
              gap: 0.5rem; /* gap-2 */
            }

            .refresh-button {
              padding: 0.5rem;
              color: #a0aec0; /* gray-400 */
              border-radius: 9999px; /* rounded-full */
              transition-property: color;
              transition-duration: 0.2s;
              transition-timing-function: ease-in-out;
              background: none;
              border: none;
              cursor: pointer;
            }
            .refresh-button:hover {
              color: white;
            }

            .main-content {
              flex: 1;
              padding: 1rem;
              overflow-y-auto;
            }

            .flex-col-gap-4 {
                display: flex;
                flex-direction: column;
                gap: 1rem; /* Equivalent to gap-4 in Tailwind */
            }

            .section-card {
              background-color: #2d3748; /* gray-800 */
              border-radius: 1rem; /* rounded-2xl */
              padding: 1.5rem; /* p-6 */
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
              text-align: center;
            }

            .total-balance-label {
              color: #a0aec0; /* gray-400 */
              font-size: 0.875rem; /* text-sm */
              font-weight: 500; /* font-medium */
              margin-bottom: 0.25rem; /* mb-1 */
            }

            .total-balance-value {
              font-size: 2.25rem; /* 4xl */
              font-weight: 800; /* font-extrabold */
              color: white;
              margin-bottom: 1rem; /* mb-4 */
            }

            .action-buttons-grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 0.75rem; /* gap-3 */
              margin-top: 1rem; /* mt-4 */
            }

            .icon-button {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 0.75rem;
              border-radius: 0.75rem; /* rounded-xl */
              background-color: rgba(255, 255, 255, 0.1);
              color: white;
              font-size: 0.75rem; /* text-xs */
              font-weight: 500; /* font-medium */
              transition: background-color 0.2s ease-in-out;
              border: none;
              cursor: pointer;
              text-decoration: none; /* For potential future links */
            }
            .icon-button:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }

            .tokens-list-card {
              background-color: #2d3748; /* gray-800 */
              border-radius: 1rem; /* rounded-2xl */
              padding: 1rem; /* p-4 */
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            }

            .tokens-list-title {
              font-size: 1.25rem; /* xl */
              font-weight: 600; /* font-semibold */
              color: white;
              margin-bottom: 1rem; /* mb-4 */
            }

            .coin-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
              border-bottom: 1px solid #4a5568; /* border-gray-700 */
              text-align: left;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              border-radius: 0.375rem; /* rounded-md */
              margin-left: -0.5rem;
              margin-right: -0.5rem;
              transition: background-color 0.2s ease-in-out;
              background: none;
              width: 100%;
              cursor: pointer;
            }
            .coin-item:last-child {
              border-bottom: none;
            }
            .coin-item:hover {
              background-color: #4a5568; /* gray-700 */
            }

            .coin-item-left {
              display: flex;
              align-items: center;
              gap: 0.75rem; /* gap-3 */
              flex: 3; /* flex-grow: 3 */
              max-width: 60%; /* Adjusted for better proportion */
              min-width: 0; /* Allow shrinking */
            }

            .coin-icon {
              width: 2.25rem; /* w-9 */
              height: 2.25rem; /* h-9 */
              border-radius: 9999px; /* rounded-full */
              flex-shrink: 0; /* Prevent icon from shrinking */
            }

            .coin-details {
              display: flex;
              flex-direction: column;
              min-width: 0; /* Allow text to wrap if too long */
            }

            .coin-name {
              color: white;
              font-weight: 500; /* font-medium */
              white-space: nowrap; /* Prevent name from wrapping */
              overflow: hidden;
              text-overflow: ellipsis; /* Add ellipsis if name is too long */
            }

            .coin-symbol {
              color: #a0aec0; /* gray-400 */
              font-size: 0.875rem; /* text-sm */
              white-space: nowrap; /* Prevent symbol from wrapping */
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .coin-item-right {
              text-align: right;
              flex: 2; /* flex-grow: 2 */
              max-width: 40%; /* Adjusted for better proportion */
              min-width: fit-content; /* Ensure content isn't cut off */
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              justify-content: center;
            }

            .coin-balance {
              color: white;
              font-weight: 600; /* font-semibold */
              white-space: nowrap;
            }

            .coin-usd-value {
              color: #a0aec0; /* gray-400 */
              font-size: 0.875rem; /* text-sm */
              white-space: nowrap;
            }

            .discover-browser-card {
              background-color: #2d3748;
              border-radius: 1rem;
              padding: 1.5rem;
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 200px; /* Adjust as needed */
            }

            .discover-browser-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: white;
              margin-bottom: 0.5rem;
            }

            .discover-browser-text {
              color: #a0aec0;
              text-align: center;
              max-width: 20rem; /* max-w-sm */
            }

            .bottom-navigation {
              background-color: #2d3748; /* gray-800 */
              border-top: 1px solid #4a5568; /* border-gray-700 */
              display: flex;
              justify-content: space-around;
              padding: 0.5rem;
              box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
              z-index: 10;
            }

            .tab-button {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 0.5rem;
              color: #ccc;
              font-size: 0.75rem;
              font-weight: 500;
              transition: color 0.2s ease-in-out;
              background: none;
              border: none;
              cursor: pointer;
            }
            .tab-button.active {
              color: #3b82f6; /* blue-500 */
            }
            .tab-button:hover {
              color: #eee;
            }


            /* Modals */
            .modal-overlay {
              position: fixed;
              inset: 0;
              background-color: rgba(0, 0, 0, 0.75);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
              z-index: 50;
            }

            .modal-content {
              background-color: #2d3748; /* gray-800 */
              border-radius: 1rem; /* rounded-xl */
              padding: 1.5rem; /* p-6 */
              width: 100%;
              max-width: 24rem; /* max-w-sm */
              border: 1px solid #4a5568; /* border-gray-700 */
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
              position: relative;
            }

            .modal-close-button {
              position: absolute;
              top: 0.75rem; /* top-3 */
              right: 0.75rem; /* right-3 */
              color: #a0aec0; /* gray-400 */
              font-size: 1.5rem; /* text-2xl */
              background: none;
              border: none;
              cursor: pointer;
              transition: color 0.2s;
            }
            .modal-close-button:hover {
              color: white;
            }

            .modal-title {
              font-size: 1.5rem; /* 2xl */
              font-weight: 700; /* bold */
              color: white;
              margin-bottom: 1rem; /* mb-4 */
            }

            .modal-text-description {
              color: #d1d5db; /* gray-300 */
              margin-bottom: 1rem; /* mb-4 */
            }

            .address-display {
              background-color: #4a5568; /* gray-700 */
              padding: 1rem; /* p-4 */
              border-radius: 0.5rem; /* rounded-lg */
              word-break: break-all;
              font-size: 0.875rem; /* text-sm */
              font-family: monospace; /* font-mono */
              text-align: center;
              color: #6ee7b7; /* green-300 */
              margin-bottom: 1rem; /* mb-4 */
            }

            .modal-text-small {
              font-size: 0.875rem; /* text-sm */
              color: #a0aec0; /* gray-400 */
            }

            .modal-action-button {
              width: 100%;
              background-color: #4a5568; /* gray-600 */
              color: white;
              font-weight: 600; /* font-semibold */
              padding: 0.75rem 1rem; /* py-3 px-4 */
              border-radius: 0.75rem; /* rounded-xl */
              margin-top: 1.5rem; /* mt-6 */
              transition: background-color 0.2s ease-in-out;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              border: none;
              cursor: pointer;
            }
            .modal-action-button:hover {
              background-color: #2d3748; /* gray-700 */
            }

            .balance-info {
              margin-top: 0.5rem; /* mt-2 */
              margin-bottom: 1rem; /* mb-4 */
              padding: 0.75rem; /* p-3 */
              background-color: #4a5568; /* gray-700 */
              border-radius: 0.5rem; /* rounded-lg */
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .balance-text {
              font-size: 0.875rem; /* text-sm */
              color: #d1d5db; /* gray-300 */
            }

            .balance-value {
              font-weight: 700; /* font-bold */
              color: #93c5fd; /* blue-300 */
            }

            .max-button {
              background-color: #4a5568; /* gray-600 */
              color: white;
              font-size: 0.75rem; /* text-xs */
              font-weight: 600; /* font-semibold */
              padding: 0.25rem 0.75rem; /* py-1 px-3 */
              border-radius: 0.5rem; /* rounded-lg */
              transition: background-color 0.2s;
              border: none;
              cursor: pointer;
            }
            .max-button:hover {
              background-color: #6b7280; /* gray-500 */
            }

            .input-field {
              width: 100%;
              background-color: #4a5568; /* gray-700 */
              color: white;
              padding: 0.75rem; /* p-3 */
              border-radius: 0.5rem; /* rounded-lg */
              margin-bottom: 0.25rem; /* mb-1 */
              outline: none;
              border: 2px solid transparent;
            }
            .input-field:focus {
              border-color: #3b82f6; /* ring-blue-500 */
              box-shadow: 0 0 0 2px #3b82f6;
            }

            .usd-equivalent-text {
              font-size: 0.875rem; /* text-sm */
              color: #a0aec0; /* gray-400 */
              text-align: right;
              margin-bottom: 1rem; /* mb-4 */
            }

            .error-message {
              color: #f87171; /* red-400 */
              font-size: 0.75rem; /* text-xs */
              margin-bottom: 0.75rem; /* mb-3 */
            }

            .confirm-send-button {
              width: 100%;
              background-color: #dc2626; /* red-600 */
              color: white;
              font-weight: 600; /* font-semibold */
              padding: 0.75rem 1rem; /* py-3 px-4 */
              border-radius: 0.75rem; /* rounded-xl */
              margin-top: 1.5rem; /* mt-6 */
              transition: background-color 0.2s ease-in-out;
              border: none;
              cursor: pointer;
            }
            .confirm-send-button:hover {
              background-color: #b91c1c; /* red-700 */
            }

            .text-center-container {
              text-align: center;
              padding-top: 2rem; /* py-8 */
              padding-bottom: 2rem; /* py-8 */
            }

            .modal-text-large {
              font-size: 1.125rem; /* lg */
              color: #d1d5db; /* gray-300 */
              margin-bottom: 1rem; /* mb-4 */
            }

            .modal-text-medium {
              font-size: 1rem; /* md */
              color: #a0aec0; /* gray-400 */
              margin-bottom: 1.5rem; /* mb-6 */
            }

            .deposit-fee-button {
              width: 100%;
              background-color: #2563eb; /* blue-600 */
              color: white;
              font-weight: 600; /* font-semibold */
              padding: 0.75rem 1rem; /* py-3 px-4 */
              border-radius: 0.75rem; /* rounded-xl */
              margin-top: 1rem; /* mt-4 */
              transition: background-color 0.2s ease-in-out;
              border: none;
              cursor: pointer;
            }
            .deposit-fee-button:hover {
              background-color: #1d4ed8; /* blue-700 */
            }

            .cancel-withdrawal-button {
              width: 100%;
              background-color: #4a5568; /* gray-600 */
              color: white;
              font-weight: 600; /* font-semibold */
              padding: 0.75rem 1rem; /* py-3 px-4 */
              border-radius: 0.75rem; /* rounded-xl */
              margin-top: 0.75rem; /* mt-3 */
              transition: background-color 0.2s ease-in-out;
              border: none;
              cursor: pointer;
            }
            .cancel-withdrawal-button:hover {
              background-color: #2d3748; /* gray-700 */
            }

            /* Coin Selection Modal Specific Styles */
            .coin-selection-grid-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr); /* 3 columns */
                gap: 0.75rem; /* gap-3 */
                max-height: 20rem; /* max-h-80 */
                overflow-y: auto; /* custom-scrollbar effect */
                padding-right: 0.5rem; /* For scrollbar space */
            }

            .coin-selection-grid-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #4a5568; /* gray-700 */
                border-radius: 0.75rem; /* rounded-xl */
                padding: 0.75rem; /* p-3 */
                text-align: center;
                transition: background-color 0.2s ease-in-out;
                border: none;
                cursor: pointer;
                width: 100%; /* Ensure items take full grid cell width */
            }
            .coin-selection-grid-item:hover {
                background-color: #2d3748; /* gray-800 */
            }

            .coin-icon-small {
                width: 3rem; /* w-12 */
                height: 3rem; /* h-12 */
                border-radius: 9999px; /* rounded-full */
                margin-bottom: 0.5rem; /* mb-2 */
            }

            .coin-name-small {
                color: white;
                font-weight: 500; /* font-medium */
                font-size: 0.875rem; /* text-sm */
                margin-bottom: 0.25rem;
            }

            .coin-symbol-small {
                color: #a0aec0; /* gray-400 */
                font-size: 0.75rem; /* text-xs */
            }

            /* Custom scrollbar for CoinSelectionModal */
            .modal-scroll-area::-webkit-scrollbar,
            .coin-selection-grid-container::-webkit-scrollbar {
              width: 8px;
            }
            .modal-scroll-area::-webkit-scrollbar-track,
            .coin-selection-grid-container::-webkit-scrollbar-track {
              background: #333;
              border-radius: 10px;
            }
            .modal-scroll-area::-webkit-scrollbar-thumb,
            .coin-selection-grid-container::-webkit-scrollbar-thumb {
              background: #555;
              border-radius: 10px;
            }
            .modal-scroll-area::-webkit-scrollbar-thumb:hover,
            .coin-selection-grid-container::-webkit-scrollbar-thumb:hover {
              background: #777;
            }
          `}
        </style>

        {/* Top Bar */}
        <header className="header-bar">
          <h1 className="header-title">
            Wallet
          </h1>
          <button onClick={handleRefresh} className="refresh-button">
            Refresh
          </button>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          {activeTab === 'wallet' && (
            <div className="flex-col-gap-4">
              {/* Total Balance Overview */}
              <div className="section-card">
                <p className="total-balance-label">Total Balance</p>
                <h2 className="total-balance-value">
                  {formatCurrency(totalPortfolioValue)}
                </h2>
                {/* Action Buttons */}
                <div className="action-buttons-grid">
                  <button onClick={openCoinSelectionForSend} className="icon-button">
                    Send
                  </button>
                  <button onClick={openCoinSelectionForReceive} className="icon-button">
                    Receive
                  </button>
                  <button onClick={handleSell} className="icon-button">
                    Sell
                  </button>
                </div>
              </div>

              {/* Assets List */}
              <div className="tokens-list-card">
                <h3 className="tokens-list-title">Tokens</h3>
                {sortedAssets.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => openModal('receive', asset)}
                    className="coin-item"
                  >
                    <div className="coin-item-left">
                      <img src={asset.icon} alt={asset.name} className="coin-icon" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/555555/FFFFFF?text=?" }} />
                      <div className="coin-details">
                        <p className="coin-name">{asset.name}</p>
                        <p className="coin-symbol">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="coin-item-right">
                      <p className="coin-balance">
                          {getAssetBalance(asset.id).toFixed(asset.id === 'btc' ? 8 : 4)} {asset.symbol}
                      </p>
                      <p className="coin-usd-value">
                          {formatCurrency(getAssetBalance(asset.id) * asset.usdPrice)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="discover-browser-card">
              <h2 className="discover-browser-title">Discover DApps</h2>
              <p className="discover-browser-text">
                Explore decentralized applications, NFTs, and other Web3 services.
              </p>
            </div>
          )}

          {activeTab === 'browser' && (
            <div className="discover-browser-card">
              <h2 className="discover-browser-title">DApp Browser</h2>
              <p className="discover-browser-text">
                Interact directly with decentralized applications within the wallet.
              </p>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <footer className="bottom-navigation">
          <button
            className={`tab-button ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
          <button
            className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
          <button
            className={`tab-button ${activeTab === 'browser' ? 'active' : ''}`}
            onClick={() => setActiveTab('browser')}
          >
            Browser
          </button>
        </footer>

        {/* Render Coin Selection Modal for RECEIVE */}
        <CoinSelectionModal
          isOpen={isCoinSelectionModalOpen}
          assets={assets}
          onSelectCoin={(coin) => {
            openModal('receive', coin);
            closeCoinSelectionModal();
          }}
          onClose={closeCoinSelectionModal}
          title="Receive Which Coin?"
        />

        {/* Render Coin Selection Modal for SEND */}
        <CoinSelectionModal
          isOpen={isCoinSelectionForSendModalOpen}
          assets={assets}
          onSelectCoin={(coin) => {
            openModal('send', coin);
            closeCoinSelectionForSendModal();
          }}
          onClose={closeCoinSelectionForSendModal}
          title="Send Which Coin?"
        />

        {/* Action (Send/Receive/Sell/DepositPrompt) Modal */}
        <ActionModal
          isOpen={isModalOpen}
          type={modalType}
          coin={selectedCoin}
          onClose={closeModal}
          assets={assets}
          handleReceive={handleReceive}
          handleGenericSend={handleGenericSend}
          handleBtcWithdrawal={handleBtcWithdrawal}
        />
      </div>
    </div>
  );
}

export default App;
