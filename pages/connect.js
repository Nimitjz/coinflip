import { useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Connect.module.css';
import Image from 'next/image';

const ConnectPage = () => {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        if (isConnecting) {
            alert("Connection request already pending. Please wait.");
            return;
        }

        setIsConnecting(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const address = accounts[0];
            setUserAddress(address);

            const balance = await provider.getBalance(address);
            setBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));

            setIsConnected(true);
        } catch (error) {
            console.error(error);
            alert("Failed to connect wallet. Please try again.");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className={styles.connectContainer}>
            <h1 className={styles.title}>Welcome to Coin Flip</h1>
            <Image src="/connect.jpeg" alt="Connect Image" className={styles.backgroundImage} layout="fill" objectFit="cover" quality={100} />
            <div className={styles.address}>Wallet ID: {userAddress || 'not connected'}</div>
            <div className={styles.balance}>Available Balance: {isConnected ? `${balance} ETH` : ''}</div>
            <button
                className={styles.connectButton}
                onClick={connectWallet}
                disabled={isConnected}
            >
                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            {isConnected && (
                <button
                    className={styles.playButton}
                    onClick={() => window.location.href = '/game'}
                >
                    Play
                </button>
            )}
        </div>
    );
};

export default ConnectPage;
