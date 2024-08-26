import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

const HomePage = () => {
    const router = useRouter();

    const handlePlayClick = () => {
        router.push('/connect'); // Navigate to the connect page
    };

    return (
        <div className={styles.walletContainer}>
            <img src="/mainpage.jpg" alt="Coin Flip Game" className={styles.image} />
            <h1 className={styles.title}>Flip the Coin</h1>
            <button className={styles.button} onClick={handlePlayClick}>
                Let's Play
            </button>
            <h2 className={styles.subtitle}>2x reward for every win</h2>
        </div>
    );
};

export default HomePage;
