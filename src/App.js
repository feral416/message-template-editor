import "./App.css";
import Editor from "./components/message_template_editor";

const testVarNames = [{name: "firstname", value: "Bill"}, {name: "familyname", value: "Gates"}, {name: "company", value: "Microsoft"}];
const testTemplate = "Hey [First Name], we’re offering [Discount Amount] off [Product/Service] at [Company Name]. Only until [Month] end. Come check us out at [Location] on [Address].";


function App() {
  return (
      <Editor key="editor" arrVarNames={testVarNames} template={testTemplate}/>
  );
}

export default App;
