import "./../assets/scss/MainScreen.scss";
// import { Power } from 'lucide-react';
// import { Wifi } from 'lucide-react';
// import { PersonStanding } from 'lucide-react';

import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";

export default function MainScreen({ solvePuzzle, solved, solvedTrigger }) {
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState("");
  const [userName, setUserName] = useState("");
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  const [fail, setFail] = useState(false);
  const { appSettings: config, I18n } = useContext(GlobalContext);

  const sendSolution = () => {
    if (solution.trim() === "" || userName.trim() === "") return;
    setSolutionSubmitted(true);
    const parsedSolution = config.usernameRequired ? `${userName};${solution}` : solution;
    solvePuzzle(parsedSolution);
  };

  useEffect(() => {
    if (!solutionSubmitted) return;
    if (!solved) {
      setUserName("");
      setSolution("");
      setFail(true);
    }
  }, [solvedTrigger]);

  return (
    <div className="frame">
      <div className="containerLogin">
        <div className="imgAvatar" style={{ backgroundImage: `url(${config.avatarImg})` }}></div>
        {!fail ? (
          <>
            {config.usernameRequired ? (
              <h2 className="userName">
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendSolution()}
                  className="input"
                  id="user name"
                  type="text"
                  value={userName}
                  placeholder={config.userName}
                ></input>
              </h2>
            ) : (
              <h2 className="userName">{config.userName}</h2>
            )}

            <div className="input-wrapper">
              <input
                onChange={(e) => setSolution(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendSolution()}
                className="input"
                id="password"
                type="password"
                value={solution}
                placeholder={config.passwordPlaceholder}
              />

              {/* Botón de enviar */}
              <button className="send-btn" onClick={() => sendSolution()}>
                ➜
              </button>
            </div>
            {config.hint && (
              <>
                <p onClick={() => (showHint ? setShowHint(false) : setShowHint(true))} className="forgotPIN">
                  {I18n.getTrans("i.pass")}
                </p>
                <p className="hint" style={{ visibility: showHint ? "" : "hidden" }}>
                  {config.hint}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="wrongPassFeedback" style={{ marginTop: "3rem" }}>
              {" "}
              {I18n.getTrans(config.usernameRequired ? "i.wrongUserPass" : "i.wrongPass")}
            </p>
            <button className="ok-button" onClick={() => setFail(false)}>
              {I18n.getTrans("i.ok")}
            </button>
          </>
        )}
      </div>

      <div className="footer">
        <img className="icon" src="./images/wifi-icon.svg"></img>
        <img className="icon" src="./images/accesibility-icon.svg"></img>
        <img className="icon" src="./images/power-icon.svg"></img>
      </div>
    </div>
  );
}
