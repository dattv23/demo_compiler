import { Select, Button } from "antd";
import { Input } from "antd";
import { useState } from "react";
import axios from "axios";
import CodeMirror from '@uiw/react-codemirror';;

const languages = ["c", "cpp", "javascript", "java", "python"];

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");

  const onChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const submit = async () => {
    try {
      setOutput("");
      const { data } = await axios.post(
        'http://localhost:8080/api/submissions',
        {
          "code": sourceCode,
          "language": selectedLanguage
        }
      );
      setOutput(data.output);
      let intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:8080/api/statusSubmissions",
          { params: { id: data.submissionId } }
        );
        const { success, submission, error } = dataRes;
        if (success) {
          const { statusSubmit, output } = submission;
          setStatus(statusSubmit);
          if (statusSubmit === "pending") return;
          setOutput(output);
          clearInterval(intervalId);
        } else {
          setStatus("Error: Please retry!");
          setOutput(error);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Xử lý lỗi Axios
        if (error.response) {
          const errMsg = error.response.data.err.stderr;
          setOutput(errMsg);
        } else {
          setOutput("Error connecting to the server!");
        }
      } else {
        // Xử lý các lỗi khác
        setOutput("An error occurred: " + error.message);
      }
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
        <CodeMirror value={sourceCode} className="w-full h-60 my-2" onChange={(value) => setSourceCode(value)} />
        {/* <Input.TextArea rows={10} className="m-2" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} /> */}
        <div>
          <Button type="primary" className="bg-red-400" onClick={submit}>Submission</Button>
        </div>
        <div className="m-2">
          <p>{status}</p>
          <h2>Output:</h2>
          <p>{output}</p>
        </div>
      </div>
    </div>
  );
}