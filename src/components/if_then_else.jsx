import styles from '../styles/if_then_else.module.css';

export default function IfThenElse() {
  return (
    <div className={styles.if_then_else_container}>
      <div><span className={styles.row_name}>IF</span><button type="button" className={styles.delete_btn}>Delete</button><input type="text"></input></div>
      <div><span className={styles.row_name}>THEN</span><input type="text"></input></div>
      <div><span className={styles.row_name}>ELSE</span><input type="text"></input></div>
    </div>
  );
}