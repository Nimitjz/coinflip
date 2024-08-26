import { ethers } from 'ethers';
import styles from './CoinflipGame.module.css';

const TransactionHandler = ({ userAddress, finalBalance, initialBalance }) => {
    const handleTransaction = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const difference = finalBalance - initialBalance;

            if (difference !== 0) {
                const transaction = await signer.sendTransaction({
                    to: userAddress,
                    value: ethers.parseEther(Math.abs(difference).toString()),
                    gasLimit: 21000,  // Optional: Adjust based on network
                });
                console.log('Transaction hash:', transaction.hash);
            } else {
                console.log('No change in balance.');
            }
        } catch (error) {
            console.error('Transaction failed:', error.message);
        }
    };

    return (
        <div className={styles.transactionContainer}>
            <button className={styles.button} onClick={handleTransaction}>Submit Final Transaction</button>
        </div>
    );
};

export default TransactionHandler;
