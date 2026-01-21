import "./../assets/scss/MainScreen.scss";
// import { Power } from 'lucide-react';
// import { Wifi } from 'lucide-react';
// import { PersonStanding } from 'lucide-react';

import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";

export default function MainScreen({ solvePuzzle, submitPuzzleSolution, solved, solvedTrigger }) {
  const { appSettings, I18n } = useContext(GlobalContext);
  const [showHint, setShowHint] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(appSettings.username);
  const [solution, setSolution] = useState(false);
  const [fail, setFail] = useState(false);

  const sendSolution = () => {
    let currentSolution = "";
    if (appSettings.usernameRequired===true) {
      if (password.trim() === "" || username.trim() === "") return;
      currentSolution = `${username};${password}`;
    } else {
      if (password.trim() === "") return;
      currentSolution = password;
    }
    setSolution(currentSolution);
    solvePuzzle(currentSolution);
  };

  useEffect(() => {
    if (solution === false) return;
    if (solvedTrigger < 1) return;
    if (!solved) {
      // if (appSettings.usernameRequired===true){
      //   setUsername("");
      // }
      setPassword("");
      setFail(true);
      document.getElementById("audio_failure").play(); //Play failure audio
    }
  }, [solvedTrigger]);

  return (
    <div className="frame">
      <audio id="audio_failure" src={appSettings.soundLoginNok} autostart="false" preload="auto" />
      <audio id="audio_success" src={appSettings.soundLoginOk} autostart="false" preload="auto" />
      <div className="containerLogin">
        <div className="imgAvatar" style={{ backgroundImage: `url(${appSettings.avatarImg})` }}></div>
        {fail ? (
          <>
            <p className="feedback failureFeedback">
              {I18n.getTrans(appSettings.usernameRequired ? "i.wrongUserPass" : "i.wrongPass")}
            </p>
            <button className="ok-button" onClick={() => setFail(false)}>
              {I18n.getTrans("i.ok")}
            </button>
          </>
        ) : (solved && appSettings.actionAfterSolve === "SHOW_MESSAGE") ? (
          <>
            <p className="feedback successFeedback">
              {appSettings.message}
            </p>
            <button className="ok-button" onClick={() => submitPuzzleSolution(solution)}>
              {I18n.getTrans("i.ok")}
            </button>
          </>
        ) : (solved && appSettings.actionAfterSolve === "NONE") ? (
          <>
            <p className="feedback successFeedback">
              {I18n.getTrans("i.successfulLogin")}
            </p>
          </>
        ) : (
          <>
            {appSettings.usernameRequired ? (
              <h2 className="username">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendSolution()}
                  className="input"
                  id="user name"
                  type="text"
                  value={username}
                  placeholder={I18n.getTrans("i.username_placeholder")}
                  autocomplete="new-username"
                ></input>
              </h2>
            ) : (
              <h2 className="username">{appSettings.username}</h2>
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
                autocomplete="new-password"
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
        )}
      </div>

      <div className="footer">
        {appSettings.icons && appSettings.icons.includes("wifi") && (
          <img className="icon" src="./images/wifi-icon.svg" />
        )}

        {appSettings.icons && appSettings.icons.includes("accessibility") && (
          <img className="icon" src="./images/accessibility-icon.svg" />
        )}

        {appSettings.icons && appSettings.icons.includes("power") && (
          <img className="icon" src="./images/power-icon.svg" />
        )}
      </div>
    </div>
  );
}
