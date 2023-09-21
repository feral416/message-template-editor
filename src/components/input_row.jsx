import styles from '../styles/input_row.module.css';
import useAutosizeTextArea from '../utils';
import {useRef} from 'react';

export default function InputRow({record, callbackSaveLastFocused, handleChange}) {
  const refToText = useRef(null);
  useAutosizeTextArea(refToText.current, refToText.current?.value);
  return (
  <div className={styles.input_row}>
    <span>{record.term}</span>
    <textarea id={record.id} className={styles.field} onFocus={callbackSaveLastFocused} ref={refToText} value={record.value} onChange={handleChange}></textarea>
  </div>
  );
}