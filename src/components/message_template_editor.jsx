import styles from '../styles/editor.module.css';
import React, {useState, useRef} from 'react';
import Variables from "./variable_buttons";
import IfThenElse from './if_then_else';
import useAutosizeTextArea from '../utils';


export default function Editor({arrVarNames, template = "", callbackSave}) {
  const [msgTemplate, changeTemplate] = useState(template);
  const textareaRef = useRef(null);
  useAutosizeTextArea(textareaRef.current, msgTemplate);

  function callbackPlaceVar(name) {
    const cursorPosition = textareaRef.current.selectionStart;
    const newTemplate = msgTemplate.slice(0, cursorPosition) + name + msgTemplate.slice(cursorPosition);
    changeTemplate(newTemplate);
  }

  function handleChange(e) {
    changeTemplate(e.target.value);
  }


  return(
    <div className="editor">
      <h1>Message Template Editor</h1>
      <Variables arrVarNames={arrVarNames} callbackPlaceVar={callbackPlaceVar}/>
      <button>Click to add: IF THEN ELSE</button>
      <form>
        <textarea 
        value={msgTemplate}
        ref={textareaRef}
        onChange={handleChange}
        className={styles.textarea}>  
        </textarea>
        <IfThenElse />
        <div>
          <button>
            Preview
          </button>
          <button type="submit">
            Save
          </button>
          <button>
            Close
          </button>
        </div>
      </form>

    </div>
    

  );
}