import styles from './LoadingSkeleton.module.css';

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.icon} />
      <div className={styles.title} />
      <div className={styles.desc} />
      <div className={styles.descShort} />
      <div className={styles.footer}>
        <div className={styles.category} />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }) {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.spinnerCircle} />
    </div>
  );
}

export function ProgressBar({ progress = 0 }) {
  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}


