import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './CoinflipGame.module.css';

const WalletConnection = ({ onConnect }) => {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const connectWallet = async () => {
            if (!window.ethereum) {
                alert("MetaMask is not installed!");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const address = accounts[0];
            setUserAddress(address);

            // Fetch the actual wallet balance
            const balance = await provider.getBalance(address);
            setBalance(parseFloat(ethers.formatEther(balance)).toFixed(4)); // Fetch and format balance
            onConnect({ address, balance: parseFloat(ethers.formatEther(balance)).toFixed(4) });
        };
        connectWallet();
    }, [onConnect]);

    return (
        <div className={styles.walletContainer}>
            <h3>Connected Wallet: {userAddress}</h3>
            {/* Display actual balance as if it's a virtual wallet */}
            <h4>Available Balance: {balance} ETH</h4>
        </div>
    );
};

export default WalletConnection;
