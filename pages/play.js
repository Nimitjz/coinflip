import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Coinflip from '../artifacts/contracts/Coinflip.json'; // Ensure this path is correct
import styles from '../frontpage/styles.module.css'; // Import styles for play page

const CoinflipGame = () => {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [betAmount, setBetAmount] = useState('');
    const [side, setSide] = useState('');
    const contractAddress = '0xE373Bd383ACBD517409cC47305731759f8Ce40AC';

    useEffect(() => {
        const fetchBalance = async () => {
            if (!userAddress) return;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(userAddress); // Fetch balance
            setBalance(ethers.formatEther(balance)); // Format balance
        };

        fetchBalance();
    }, [userAddress]);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("MetaMask is not installed!");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
    };

    const flipCoin = async () => {
        if (!userAddress || !betAmount || !side) return alert("Please connect your wallet, enter bet amount, and select a side!");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Coinflip.abi, signer);

        try {
            const transaction = await contract.flipCoin(side, { value: ethers.utils.parseEther(betAmount) });
            await transaction.wait();
            alert("Coin flip successful!");
            // Update balance after transaction (you may need to fetch the balance again)
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h3>Your Address: {userAddress}</h3>
            <h3>Your Balance: {balance} ETH</h3>
            <button onClick={connectWallet}>Connect Wallet</button>
            <input
                type="number"
                placeholder="Bet Amount (ETH)"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
            />
            <div>
                <button onClick={() => setSide('heads')}>Heads</button>
                <button onClick={() => setSide('tails')}>Tails</button>
            </div>
            <button onClick={flipCoin}>Flip Coin</button>
        </div>
    );
};

export default CoinflipGame;
