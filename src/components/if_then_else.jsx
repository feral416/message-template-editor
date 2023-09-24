import styles from '../styles/if_then_else.module.css';

export default function IfThenElse({children}) {
  

  return (
    <section className={styles.if_then_else_container}>
      {children}
    </section>
  );
}