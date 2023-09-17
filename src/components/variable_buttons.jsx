import styles from '../styles/variable_buttons.module.css';
import {nanoid} from 'nanoid';

export default function Variables({arrVarNames = [], callbackPlaceVar}) {
  if (!arrVarNames.length) return <p>No variables.</p>;

  return(
    <div className={styles.button_list}>
      {arrVarNames.map((name) => {
        return (
          <button 
          key={nanoid()}
          className={styles.var_button}
          type="button"
          onClick={() => callbackPlaceVar(name)``}>
          {`{${name}}`}
          </button>)
      })}
    </div>
  );
}