import styles from '../styles/input_row.module.css';
import "../styles/input_row.css";
import useAutosizeTextArea from '../utils';
import {useRef} from 'react';

export default function InputRow({record, callbackSaveLastFocused, handleChange}) {
  const refToText = useRef(null);
  useAutosizeTextArea(refToText, record.value);
  return (
  <div className={styles.input_row}>
    <span id={record.id} className="term">{record.term}</span>
    <textarea id={record.id} className={styles.field} onFocus={callbackSaveLastFocused} ref={refToText} value={record.value} onChange={handleChange}></textarea>
  </div>
  );
}