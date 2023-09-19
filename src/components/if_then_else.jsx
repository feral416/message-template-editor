import styles from '../styles/if_then_else.module.css';

//<button type="button" className={styles.delete_btn}>Delete</button>

export default function IfThenElse({record, callbackSaveLastFocused, handleChange}) {
  

  return (
    <div className={styles.if_then_else_container}>
      <span>{record.term}</span>
      <textarea id={record.id} onFocus={callbackSaveLastFocused} value={record.value} onChange={handleChange}></textarea>
    </div>
  );
}