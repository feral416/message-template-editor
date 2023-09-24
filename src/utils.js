import { useEffect, useState } from "react";

// Updates the height of a <textarea> when the value changes.
export default function useAutosizeTextArea (textAreaRefRaw, value) {
  useEffect(() => {
    if (textAreaRefRaw.current !== null) {
      const textAreaRef = textAreaRefRaw.current;
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
  
      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
      }
    },
    [value]);
};

export const useForceRerender = statePrm => {
  const [state, setState] = useState(statePrm);
  const setStateForceUpdate = () => setState(!state);

  return  setStateForceUpdate;
}

export const useStateForceUpdate = statePrm => {
  const [state, setState] = useState(state);
  const update = useState(true)[1];
  
  const setStateForceUpdate = state => (setState(state), update(old => !old));

  return [state, setStateForceUpdate];
}
