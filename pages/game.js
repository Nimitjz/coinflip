import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Game.module.css';
import Image from 'next/image';

const GamePage = () => {
    const [betAmount, setBetAmount] = useState(0);
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [result, setResult] = useState(null);
    const [betChoice, setBetChoice] = useState(null);
    const [isBetting, setIsBetting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const address = accounts[0];
                setUserAddress(address);
                
                const balance = await provider.getBalance(address);
                setBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));
            }
        };

        fetchAccountDetails();
    }, []);

    const handleBetChange = (event) => {
        let value = parseFloat(event.target.value);
        if (value > balance) {
            value = balance;
            setModalMessage(`Bet amount cannot exceed your available balance of ${balance} ETH.`);
            setIsModalOpen(true);
        }
        setBetAmount(value);
    };

    const flipCoin = async () => {
        if (!betChoice) {
            setModalMessage("Please choose Heads or Tails.");
            setIsModalOpen(true);
            return;
        }

        if (betAmount <= 0 || betAmount > balance) {
            setModalMessage("Bet amount must be greater than 0 and less than or equal to your available balance.");
            setIsModalOpen(true);
            return;
        }

        setIsBetting(true);
        const coinFlipResult = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(coinFlipResult);

        let message;
        if (betChoice === coinFlipResult) {
            const winnings = betAmount * 2; // Double the bet amount
            message = `You won! The coin landed on ${coinFlipResult}. Your winnings are: ${winnings} ETH.`;
            setBalance((prevBalance) => parseFloat(prevBalance) + winnings);
        } else {
            message = `You lost! The coin landed on ${coinFlipResult}. Better luck next time.`;
            setBalance((prevBalance) => parseFloat(prevBalance) - betAmount);
        }

        setModalMessage(message);
        setIsBetting(false);
        setIsModalOpen(true);
    };

    const finishGame = async () => {
        setModalMessage(`Withdrawing winnings: ${balance} ETH`);
        setIsModalOpen(true);
        // Implement withdrawal logic here
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.gameContainer}>
            <h1 className={styles.title}>Welcome to Coin Flip</h1>
            <Image 
                src="/game1.jpg" 
                alt="Game Background" 
                className={styles.backgroundImage} 
                layout="fill" 
                objectFit="cover" 
                quality={100} 
            />
            <div className={styles.walletInfo}>
                <div className={styles.walletText}>Wallet ID: {userAddress || "Not connected"}</div>
                <div className={styles.balanceText}>Available Balance: {balance} ETH</div>
            </div>
            <div className={styles.betBox}>
                <h2>It's Time To Bet!</h2>
                <div>
                    <label>
                        <input type="radio" value="heads" checked={betChoice === 'heads'} onChange={() => setBetChoice('heads')} />
                        Heads
                    </label>
                    <label>
                        <input type="radio" value="tails" checked={betChoice === 'tails'} onChange={() => setBetChoice('tails')} />
                        Tails
                    </label>
                </div>
                <input
                    type="number"
                    value={betAmount}
                    onChange={handleBetChange}
                    min="0"
                    placeholder="Enter your bet"
                    step="any"
                    className={styles.noSpinner} /* Applying the class here */
                />
                <div className={styles.buttonContainer}>
                    <button onClick={flipCoin} disabled={isBetting}>Flip Coin</button>
                    <button onClick={finishGame} disabled={isBetting}>Finish Game</button>
                </div>
                {result && <h3>The coin landed on: {result}</h3>}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>{modalMessage}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;
