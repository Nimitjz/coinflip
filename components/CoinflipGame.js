import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Coinflip from "../artifacts/contracts/Coinflip.json"; // Ensure this path is correct
import styles from "./CoinflipGame.module.css";

const CoinflipGame = () => {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [selectedSide, setSelectedSide] = useState(null);
    const [winAmount, setWinAmount] = useState(0);

    const connectWallet = async () => {
        if (!window.ethereum) {
            return alert("MetaMask is not installed!");
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setUserAddress(accounts[0]);
            fetchBalance(accounts[0]);
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    };

    const fetchBalance = async (address) => {
        if (!window.ethereum) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance) * 2); // Display double the actual balance
    };

    const flipCoin = async () => {
        // Coin flip logic here, include interaction with the smart contract
        // For demonstration, you can use a simple Math.random() to simulate the coin flip
        const outcome = Math.random() < 0.5 ? "heads" : "tails"; // Simulating coin flip
        if (outcome === selectedSide) {
            alert(`You won! Your new balance is ${balance + 1}`);
            setBalance(balance + 1); // Update balance on win
        } else {
            alert(`You lost! Your balance remains ${balance}`);
        }
    };

    return (
        <div>
            <h1 className={styles.title}>Coinflip Game</h1>
            <h3 className={styles.subtitle}>Balance: {balance.toFixed(4)} ETH</h3>
            <button onClick={connectWallet} className={styles.button}>
                {userAddress ? "Connected" : "Connect Wallet"}
            </button>
            {userAddress && (
                <div>
                    <h4>Select a side:</h4>
                    <button onClick={() => setSelectedSide("heads")}>Heads</button>
                    <button onClick={() => setSelectedSide("tails")}>Tails</button>
                    <button onClick={flipCoin}>Flip Coin</button>
                </div>
            )}
        </div>
    );
};

export default CoinflipGame;
