import styles from '../styles/editor.module.css';
import React, {useState, useRef} from 'react';
import Variables from "./variable_buttons";
import InputRow from './input_row';
import {nanoid} from 'nanoid';
import { useForceRerender } from '../utils';
import IfThenElse from './if_then_else';


export default function Editor({arrVarNames, template = "", callbackSave}) {
  const [preview, setPreview] = useState(false);
  const [fullTemplate, setFullTemplate] = useState(template);
  const [elementDB, updateElementDB] = useState([{id: "root", groupID: "root", parentID: "", term: "", value: template}]);
  const lastFocusedRef = useRef(null);
  const  initForceRerender = useForceRerender(false);




  //Handler to save reference to last focused textarea
  function callbackSaveLastFocused(event) {
      lastFocusedRef.current = event.target;
  }


  //This function adds ifthenelse block and splits text blocks
  function AddIfThenElse() {
    const lastFocused = lastFocusedRef.current;
    if (lastFocused !== null && !preview) {
      const indexOfCurrent = elementDB.findIndex((element) => element.id === lastFocused.id);
        const newID = nanoid();
        const cursorPosition = lastFocused.selectionStart;
        elementDB.splice(indexOfCurrent+1, 0, 
          {id: newID, groupID: newID, parentID: lastFocused.id, term: "IF", value: ""},
          {id: `${newID}THEN`, groupID: newID, parentID: lastFocused.id, term: "THEN", value: ""},
          {id: `${newID}ELSE`, groupID: newID, parentID: lastFocused.id, term: "ELSE", value: ""},
          {id: `${newID}SPLIT`, groupID: newID, parentID: lastFocused.id, term: "", value: lastFocused.value.slice(cursorPosition)}
        )
        elementDB[indexOfCurrent].value = lastFocused.value.slice(0, cursorPosition);
        initForceRerender();

    }
  }

  function callbackPlaceVar(name) {
    if (!preview) {
      const lastFocused = lastFocusedRef.current;
      const cursorPosition = lastFocused.selectionStart;
      const newValue = lastFocused.value.slice(0, cursorPosition) + `{${name}}` + lastFocused.value.slice(cursorPosition);
      const indexOfCurrent = elementDB.findIndex((element) => element.id === lastFocused.id);
      elementDB[indexOfCurrent].value = newValue;
      initForceRerender();
    }
  }

  function handleChange(e) {
    const indexOfCurrent = elementDB.findIndex((element) => element.id === e.target.id);
    elementDB[indexOfCurrent].value = e.target.value;
    initForceRerender();
  }

/*  function handleDelete(event) {
    const copyDB = [...elementDB];
    const indexOfIf = copyDB.findIndex((element) => element.id === event.target.id);
    const indexOfParent = indexOfIf-1;
    copyDB[indexOfParent].value = copyDB[indexOfParent].value.concat(copyDB[indexOfIf+3].value);
    copyDB.splice(indexOfIf, 4);
    updateElementDB(copyDB);
  }
*/
  function handleDelete(event) {
    const indexOfIf = () => elementDB.findIndex((element) => element.id === event.target.id);
    let i = indexOfIf();
    const hasNoChild = () => elementDB.findIndex((record) => record.parentID.includes(elementDB[i].groupID)) === -1;
    while (i < elementDB.length && indexOfIf() !== -1) {
      if (hasNoChild()) {
        elementDB[i-1].value = elementDB[i-1].value.concat(elementDB[i+3].value);
        elementDB.splice(i, 4);
        i = indexOfIf();
      } else {
        i++;
      }
    }
    initForceRerender();
  }

  const content = () => {
    const outputArr = [];
    if (!preview) {
      outputArr.push(
        <Variables arrVarNames={arrVarNames} key="variables" callbackPlaceVar={callbackPlaceVar}/>,
        <button onClick={() => AddIfThenElse()}>Click to add: IF THEN ELSE</button>,
        <InputRow
          key={elementDB[0].id}
          record={elementDB[0]}
          callbackSaveLastFocused={callbackSaveLastFocused}
          handleChange={handleChange}
        />
      );
      if (elementDB.length > 0) {
        const ifThenElseContent = [];
        for (let i = 1; i < elementDB.length; i++) {
          if (elementDB[i].term === "IF") {
            ifThenElseContent.push(<button className={styles.deleteBtn} id={elementDB[i].id} type='button' onClick={handleDelete}>X</button>)
          }
          ifThenElseContent.push(
            <InputRow
              key={elementDB[i].id}
              record={elementDB[i]}
              callbackSaveLastFocused={callbackSaveLastFocused}
              handleChange={handleChange}
              handleDelete={handleDelete}
            />
          );         
        }
        outputArr.push(
          <IfThenElse>
            {ifThenElseContent}
          </IfThenElse>
        );
      }

    } else {
      outputArr.push(
          <h2>Message template preview</h2>,
          <p className='input_row'>{fullTemplate}</p>
      );
    }

    return outputArr;
  };

  function updateFullTemplate() {
    setFullTemplate(combineRows(elementDB, arrVarNames));
    return fullTemplate;
  }

  function handlePreview() {
    if (!preview) {
      updateFullTemplate();
    }
    setPreview(!preview);
  }


  return(
    <div className={styles.editor}>
      <h1>Message Template Editor</h1>
        {content()}
        <div className={styles.bottom_buttons}>
          <button type='button' onClick={handlePreview}>
            Preview
          </button>
          <button type="button" onClick={() => callbackSave(updateFullTemplate())}>
            Save
          </button>
          <button type="button">
            Close
          </button>
        </div>
    </div>
    

  );
}

//This function collapses the n-th tree and form full template
function combineRows(elemDB, arrVarNames) {
  const DB = structuredClone(elemDB);
  //replacing varnames with their values
  for (const record of DB) {
    for (const variable of arrVarNames){
      record.value = record.value.replaceAll(`{${variable.name}}`, variable.value);
    }
  }

  let i = 0;
  while (i < DB.length && DB.length !== 1) {
    //Find first occurring leaf in a tree(has no child) and not a root
    const hasNoChild = DB.findIndex((record) => record.parentID.includes(DB[i].groupID)) === -1;
    if (hasNoChild && DB[i].parentID !== "") {
      //combining values according to a logic
      //don't have to check term cuz first appeared will be IF and i-1 is parent
      if(DB[i].value === "") {
        DB[i-1].value = DB[i-1].value.concat(DB[i+2].value, DB[i+3].value);
      } else {
        DB[i-1].value = DB[i-1].value.concat(DB[i+1].value, DB[i+3].value);
      }
      //removing ifthenelse block from a DB
      DB.splice(i, 4);
      //resetting i to start a new search for a leaf
      i = 0;
    } else {
      i++;
    }
  }
  return DB[0].value;
}



/*This function combines all row values depending on if conditions
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
} */