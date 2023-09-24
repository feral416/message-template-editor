import "./App.css";
import Editor from "./components/message_template_editor";

const testVarNames = [{name: "firstname", value: "Bill"}, {name: "familyname", value: "Gates"}, {name: "company", value: "Microsoft"}];
const testTemplate = "Hey [First Name], we’re offering [Discount Amount] off [Product/Service] at [Company Name]. Only until [Month] end. Come check us out at [Location] on [Address].";


function App() {
  return (
      <Editor key="editor" arrVarNames={testVarNames} template={testTemplate} callbackSave={callbackSave}/>
  );
}

export default App;

const callbackSave = async (fullTemplate) => {
  try {
    return 0;
  }

  catch (error) {
    console.Error(error);
  }
}
