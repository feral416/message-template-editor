import useAutosizeTextArea from '../utils';
import {useRef} from 'react';

export default function InputRow({record, callbackSaveLastFocused, handleChange}) {
  const refToText = useRef(null);
  useAutosizeTextArea(refToText.current, refToText.current?.value);
  return (
  <div className='input_row'>
    <span>{record.term}</span>
    <textarea id={record.id} onFocus={callbackSaveLastFocused} ref={refToText} value={record.value} onChange={handleChange}></textarea>
  </div>
  );
}