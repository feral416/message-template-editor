import '../styles/editor.module.css';
import React, {useState, useRef, useEffect} from 'react';
import Variables from "./variable_buttons";
import IfThenElse from './if_then_else';
import InputRow from './input_row';
import {nanoid} from 'nanoid';
import useAutosizeTextArea from '../utils';


export default function Editor({arrVarNames, template = "", callbackSave}) {
  const [preview, setPreview] = useState(false);
  const [fullTemplate, setFullTemplate] = useState(template);
  const [elementDB, updateElementDB] = useState([{id: nanoid(), parentID: "", term: "", value: template}]);
  const textareaRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useAutosizeTextArea(textareaRef.current, fullTemplate);


  //Handler to save reference to last focused textarea
  function callbackSaveLastFocused(event) {
    lastFocusedRef.current = event.target;
  }


  //This function adds ifthenelse block and splits text blocks
  function AddIfThenElse() {
    const lastFocused = lastFocusedRef.current;
    if (lastFocused !== null && !preview) {
      const indexOfCurrent = elementDB.findIndex((element) => element.id === lastFocused.id);
      if (elementDB[indexOfCurrent].term === "") {
        const newID = nanoid();
        const cursorPosition = lastFocused.selectionStart;
        const copyDB = [...elementDB];
        copyDB.splice(indexOfCurrent+1, 0, 
          {id: newID, parentID: lastFocused.id, term: "IF", value: ""},
          {id: `${newID}THEN`, parentID: lastFocused.id, term: "THEN", value: ""},
          {id: `${newID}ELSE`, parentID: lastFocused.id, term: "ELSE", value: ""},
          {id: `${newID}SPLIT`, parentID: lastFocused.id, term: "", value: lastFocused.value.slice(cursorPosition)}
        )
        copyDB[indexOfCurrent].value = lastFocused.value.slice(0, cursorPosition);
        updateElementDB(copyDB);
      }

    }
  }

  function callbackPlaceVar(name) {
    if (!preview) {
      const lastFocused = lastFocusedRef.current;
      const cursorPosition = lastFocused.selectionStart;
      const newValue = lastFocused.value.slice(0, cursorPosition) + name + lastFocused.value.slice(cursorPosition);
      const indexOfCurrent = elementDB.findIndex((element) => element.id === lastFocused.id);
      const copyDB = [...elementDB];
      copyDB[indexOfCurrent].value = newValue;
      updateElementDB(copyDB);
    }
  }

  function handleChange(e) {
    const indexOfCurrent = elementDB.findIndex((element) => element.id === e.target.id);
    const copyDB = [...elementDB];
    copyDB[indexOfCurrent].value = e.target.value;
    updateElementDB(copyDB);
  }

  function handleDelete(event) {
    const copyDB = [...elementDB];
    const indexOfIf = copyDB.findIndex((element) => element.id === event.target.id);
    const indexOfParent = indexOfIf-1;
    copyDB[indexOfParent].value = copyDB[indexOfParent].value.concat(copyDB[indexOfIf+3].value);
    copyDB.splice(indexOfIf, 4);
    updateElementDB(copyDB);
  }

  const content = () => {
    const outputArr = [];
    if (!preview) {
      outputArr.push(
        <Variables arrVarNames={arrVarNames} key="variables" callbackPlaceVar={callbackPlaceVar}/>,
        <button onClick={() => AddIfThenElse()}>Click to add: IF THEN ELSE</button>
      );
      elementDB.map((record) => {       
      if (record.term === "IF") {
        outputArr.push((
          <button id={record.id} type='button' onClick={handleDelete}>Delete</button>
        ))
      }
      outputArr.push(
        <InputRow
        key={record.id}
        record={record}
        callbackSaveLastFocused={callbackSaveLastFocused}
        handleChange={handleChange}
      />
      );
    });
    } else {
      outputArr.push(
          <h2>Message template preview</h2>,
          <p className='input_row'>{fullTemplate}</p>
      );
    }

    return outputArr;
  };

  function updateFullTemplate() {
    setFullTemplate(combineRows(elementDB));
    return fullTemplate;
  }

  function handlePreview() {
    if (!preview) {
      updateFullTemplate();
    }
    setPreview(!preview);
  }

  //useEffect(() => {}, [elementDB]);

  return(
    <div className="editor">
      <h1>Message Template Editor</h1>
        {content()}
        <div>
          <button type='button' onClick={handlePreview}>
            Preview
          </button>
          <button type="button" onClick={() => callbackSave(updateFullTemplate())}>
            Save
          </button>
          <button>
            Close
          </button>
        </div>
    </div>
    

  );
}

function findRecordById(DB, ID, term) {
  return DB.find((record) => record.id === `${ID}${term}`);
}

//This function combines all row values depending on if conditions
function combineRows(DB) {
  let fullTemplate = "";
  DB.map((record) => {
    if (record.term === "") {
      fullTemplate += record.value;
    } else if (record.term === 'IF' && record.value !== "") {
      fullTemplate += findRecordById(DB, record.id, 'THEN')?.value;
    } else if (record.term === 'IF'){
      fullTemplate += findRecordById(DB, record.id, 'ELSE')?.value;
    }
  });
  return fullTemplate;
}