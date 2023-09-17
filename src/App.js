import './App.css';
import Editor from "./components/message_template_editor";

const testVarNames = ["Bill", "Gates", "Microsoft"];
const testTemplate = "Hey [First Name], we’re offering [Discount Amount] off [Product/Service] at [Company Name]. Only until [Month] end. Come check us out at [Location] on [Address].";


function App() {
  return (
    <Editor arrVarNames={testVarNames} template={testTemplate}/>
  );
}

export default App;
