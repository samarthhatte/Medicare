import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ASK_AI_CHAT } from "../../../Context/constants";
import { BsSendFill, BsRobot } from "react-icons/bs";
import { FaUserAlt, FaRegCopy } from "react-icons/fa";

const AI = () => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [chatArray, setChatArray] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [update, setUpdate] = useState(0); 
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    const AI_ASK_HISTORY = JSON.parse(localStorage.getItem("AI_ASK_HISTORY")) || [];
    setChatArray(AI_ASK_HISTORY);
  }, [update]);

  const CALLING_AI = async () => {
    if (!prompt) return;
    try {
      setLoader(true);
      const response = await ASK_AI_CHAT(prompt);
      
      if (response) {
        setUpdate((prev) => prev + 1); // trigger UI update
        setPrompt("");
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setErrorMsg(error.message);
      notifyError(error.message);
      console.error(error);
    }
  };

  const copyResponse = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copied successfully");
  };

  const clearAIChatHistory = () => {
    localStorage.removeItem("AI_ASK_HISTORY");
    setChatArray([]);
    toast.success("AI chat history cleared!");
  };

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">ASK </a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">YUVI AI</a>
          </li>
        </ol>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div>
                  <div className="d-flex align-items-center">
                    <h4 className="card-title d-sm-none d-block">Ask AI</h4>
                  </div>

                  <div
                    style={{
                      height: "20rem",
                      width: "100%",
                      marginBottom: "1rem",
                      border: "2px solid #EDF0F1",
                      borderRadius: "5px",
                      overflowY: "auto",
                    }}
                  >
                    <div
                      className="card-body msg_card_body dz-scroll"
                      id="DZ_W_Contacts_Body3"
                    >
                      {chatArray?.map((chat, index) => (
                        <div key={index}>
                          <div className="d-flex justify-content-start mb-4">
                            <div className="img_cont_msg">
                              <p style={{ width: "40px" }}>
                                <FaUserAlt />
                              </p>
                            </div>
                            <div className="msg_cotainer">
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                              >
                                {chat?.prompt}
                              </pre>
                              <small>⏰ {chat?.timestamp}</small> &nbsp;&nbsp;
                              <FaRegCopy onClick={() => copyResponse(chat?.prompt)} />
                            </div>
                          </div>

                          <div className="d-flex justify-content-start mb-4">
                            <div className="img_cont_msg">
                              <p style={{ width: "40px" }}>
                                <BsRobot />
                              </p>
                            </div>
                            <div className="msg_cotainer">
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                              >
                                {chat?.message}
                              </pre>
                              <small>
                                <FaRegCopy onClick={() => copyResponse(chat?.message)} />
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="compose-content">
                    <div>
                      <div className="mb-3">
                        <textarea
                          id="email-compose-editor"
                          className="textarea_editor form-control bg-transparent"
                          rows={2}
                          placeholder="Enter prompt ..."
                          onChange={(e) => setPrompt(e.target.value)}
                          value={prompt}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              CALLING_AI();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-start mt-4 mb-3">
                    {loader ? (
                      <button
                        className="btn btn-primary btn-sl-sm"
                        type="button"
                      >
                        <div className="custom-loader"></div>
                      </button>
                    ) : errorMsg ? (
                      <button
                        className="btn btn-primary btn-sl-sm"
                        type="button"
                        disabled={!prompt}
                      >
                        <span className="me-2">
                          <i className="fa">
                            <BsSendFill />
                          </i>
                        </span>
                        {errorMsg}
                      </button>
                    ) : (
                      <button
                        onClick={CALLING_AI}
                        className="btn btn-primary btn-sl-sm"
                        type="button"
                        disabled={!prompt}
                      >
                        <span className="me-2">
                          <i className="fa">
                            <BsSendFill />
                          </i>
                        </span>
                        Ask AI
                      </button>
                    )}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={clearAIChatHistory}
                  >
                    Clear Chat History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;               