import { Select, Button } from "antd";
// import { Input } from "antd";
import { useState } from "react";
import axios from "axios";
import CodeMirror from '@uiw/react-codemirror'; import { error } from "console";
;

const languages = ["c", "cpp", "javascript", "java", "python"];

const testCases = [
  [1, 2],
  [2, 6],
  [3, 7]
];

const outputs = ["3", "7", "10"];

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [output, setOutput] = useState<string[]>();
  const [status, setStatus] = useState("");
  const [onSubmit, setOnSubmit] = useState(false);

  const onChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const submit = async () => {
    try {
      setOnSubmit(true);
      setOutput([]);
      const { data } = await axios.post(
        'http://localhost:8080/api/submissions',
        {
          "code": sourceCode,
          "language": selectedLanguage,
          "input": testCases
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
          else {
            setOutput(output);
            clearInterval(intervalId);
          }
        } else {
          setStatus("Error: Please retry!");
          setOutput(error);
          clearInterval(intervalId);
        }
      }, 5000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Xử lý lỗi Axios
        if (error.response) {
          const errMsg = error.response.data.err.stderr;
          setOutput(errMsg);
        } else {
          setOutput(["Error connecting to the server!"]);
        }
      } else {
        // Xử lý các lỗi khác
        setOutput(["An error occurred: " + error.message]);
      }
    }
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const formatError = (output: string) => {
    let errors = output.split("\\r\\n").map((element, i) => {
      if (i === 0 && !element.includes("error")) return;
      if (element.includes("error")) {
        return (
          <pre key={i}>
            {element.slice(element.indexOf("error"))}
          </pre>
        );
      } else {
        return (
          <pre key={i}>
            {element.replace(/"/g, "")}
          </pre>
        );
      }
    });
    return errors;
  }

  return (
    <div className="min-h-screen min-w-screen bg-slate-500 flex items-center justify-center">
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
        <CodeMirror value={sourceCode} className="w-full my-2" onChange={(value) => setSourceCode(value)} />
        {/* <Input.TextArea rows={10} className="m-2" value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} /> */}
        <div>
          <Button type="primary" className="bg-red-400" onClick={submit}>Submission</Button>
        </div>
        <div className="m-2 w-full">
          <p>{status}</p>
          <h2>Testcase:</h2>
          {(output && onSubmit) && output.map((item, index) => {
            if (!item.includes("error")) {
              if (outputs.indexOf(item.replace("\r\n", "")) !== -1) return <p>{`Test case ${index + 1}: ${testCases[index].join(" ")} passed!`}</p>
              else return <p>{`Test case ${index + 1} failed!`}</p>
            }
            return <div key={index}>
              <p>Errors: </p>
              {formatError(item)}
            </div>
          })}
        </div>
      </div>
    </div>
  );
}