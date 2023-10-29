import { Select, Button } from "antd";
import { Input } from "antd";
import axios from "axios";
import moment from "moment";
import { useState } from "react";

const languages = ["c", "cpp", "javascript", "java", "python"];

interface SubmissionDetail {
  submittedAt: Date,
  startedAt: Date,
  completedAt: Date
}

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [submissionId, setSunmissionId] = useState(null);
  const [status, setStatus] = useState<string>();
  const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetail>();
  const [output, setOutput] = useState("");
  const [error, setError] = useState([]);

  const onChange = (value: string) => {
    setSelectedLanguage(value);
  };

  let pollInterval: NodeJS.Timer;
  const submit = async () => {
    try {
      setError([]);

      const { data } = await axios.post("http://localhost:8080/api/submissions", {
        "code": sourceCode,
        "language": selectedLanguage
      });
      if (data.submissionId) {
        setSunmissionId(data.submissionId);
        setStatus("Submitted.");
        console.log('====================================');
        console.log(data.submissionId);
        console.log('====================================');
        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:8080/api/statusSubmissions`,
            {
              params: {
                id: data.submissionId,
              },
            }
          );
          const { success, submission, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status, output } = submission;
            setStatus(status);
            setSubmissionDetail(submission);
            if (status === "pending") return;
            setOutput(output);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const renderTimeDetails = () => {
    if (!submissionDetail) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = submissionDetail;
    let result = "";
    const timeSubmit = moment(submittedAt).toString();
    result += `Submitted At: ${timeSubmit}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };

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
          error.length !== 0 ?
            <div className="m-2">
              <h2>Errors:</h2>
              {error.map((item) => <p>{item}</p>)}
            </div> :
            <div className="m-2">
              <p>{status}</p>
              <p>{submissionId ? `Job ID: ${submissionId}` : ""}</p>
              <p>{renderTimeDetails()}</p>
              <p>{output}</p>
            </div>
        }
      </div>
    </div>
  );
}
