import "./../assets/scss/MainScreen.scss";
// import { Power } from 'lucide-react';
// import { Wifi } from 'lucide-react';
// import { PersonStanding } from 'lucide-react';

import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";

export default function MainScreen({ solvePuzzle, solved, solvedTrigger }) {
  const { appSettings, I18n } = useContext(GlobalContext);
  const [showHint, setShowHint] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(appSettings.userName);
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  const [fail, setFail] = useState(false);

  const sendSolution = () => {
    let solution = "";
    if (appSettings.usernameRequired===true) {
      if (password.trim() === "" || userName.trim() === "") return;
      solution = `${userName};${password}`;
    } else {
      if (password.trim() === "") return;
      solution = password;
    }
    setSolutionSubmitted(true);
    solvePuzzle(solution);
  };

  useEffect(() => {
    if (!solutionSubmitted) return;
    if (!solved) {
      if (appSettings.usernameRequired===true){
        setUserName("");
      }
      setPassword("");
      setFail(true);
    }
  }, [solvedTrigger]);

  return (
    <div className="frame">
      <div className="containerLogin">
        <div className="imgAvatar" style={{ backgroundImage: `url(${appSettings.avatarImg})` }}></div>
        {!fail ? (
          <>
            {appSettings.usernameRequired ? (
              <h2 className="userName">
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendSolution()}
                  className="input"
                  id="user name"
                  type="text"
                  value={userName}
                  placeholder={I18n.getTrans("i.username_placeholder")}
                ></input>
              </h2>
            ) : (
              <h2 className="userName">{appSettings.userName}</h2>
            )}

            <div className="input-wrapper">
              <input
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendSolution()}
                className="input"
                id="password"
                type="password"
                value={password}
                placeholder={appSettings.passwordPlaceholder}
              />
              <button className="send-btn" onClick={() => sendSolution()}>
                ➜
              </button>
            </div>
            {appSettings.hint && (
              <>
                <p onClick={() => (showHint ? setShowHint(false) : setShowHint(true))} className="forgotPassword">
                  {I18n.getTrans("i.forgot_password")}
                </p>
                <p className="hint" style={{ visibility: showHint ? "" : "hidden" }}>
                  {appSettings.hint}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="wrongPassFeedback" style={{ marginTop: "3rem" }}>
              {" "}
              {I18n.getTrans(appSettings.usernameRequired ? "i.wrongUserPass" : "i.wrongPass")}
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
