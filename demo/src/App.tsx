import { Select, Button } from "antd";
import { Input } from "antd";
import { useState } from "react";

const languages = ["c", "cpp", "javascript", "java", "python"];

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState([]);

  const onChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const submit = async () => {
    try {
      setError([]);
      setOutput("");
      const response = await fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "code": sourceCode,
          "language": selectedLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = data.error.match(/error:.*$/gm); // Extract only lines that start with "error:"
        if (errorMessages) {
          setError(errorMessages);
        } else {
          setError(data.error);
        }
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }


      // Set the stdout in the state to display it
      setOutput(data.output);

    } catch (error) {
      console.error(error);
    }
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <div className="h-screen w-screen bg-slate-500 flex items-center justify-center">
      <div className="bg-slate-600 md:w-1/3 flex flex-col rounded-lg items-center sm:w-full sm:mx-1 p-2">
        <div className="mt-2 flex justify-end">
          <p>Language</p>
          <Select
            className="mr-2 ml-2 w-24"
            showSearch
            placeholder="Select a language"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={filterOption}
            options={languages.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))}
          />
        </div>
        <Input.TextArea rows={10} className="m-2" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} />
        <div>
          <Button type="primary" className="bg-red-400" onClick={submit}>Submission</Button>
        </div>
        {
          error.length != 0 ?
            <div className="m-2">
              <h2>Errors:</h2>
              {error.map((item) => <p>{item}</p>)}
            </div> :
            <div className="m-2">
              <h2>Output:</h2>
              <p>{output}</p>
            </div>
        }
      </div>
    </div>
  );
}
