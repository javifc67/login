import "./../assets/scss/MainScreen.scss";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import WifiIcon from "@mui/icons-material/Wifi";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext.jsx";

export default function MainScreen({ solvePuzzle, solved, solvedTrigger }) {
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState("");
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  const [fail, setFail] = useState(false);
  const { appSettings: config, I18n } = useContext(GlobalContext);

  const sendSolution = () => {
    setSolutionSubmitted(true);
    solvePuzzle(solution);
  };

  useEffect(() => {
    if (!solutionSubmitted) return;
    if (!solved) {
      setSolution("");
      setFail(true);
    }
  }, [solvedTrigger]);

  return (
    <div className="frame">
      <div className="containerLogin">
        <div className="imgAvatar" style={{ backgroundImage: `url(${config.avatarImg})` }}></div>
        <h2 className="userName">{config.userName}</h2>
        {!fail ? (
          <>
            <input
              onChange={(e) => setSolution(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && solution.trim() !== "") {
                  sendSolution();
                }
              }}
              className="input"
              id="password"
              type="password"
              value={solution}
            ></input>
            {config.hint && (
              <>
                <p onClick={() => showHint ? setShowHint(false) : setShowHint(true)} className="forgotPIN">
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
            <p className="wrongPassFeedback"> {I18n.getTrans("i.wrongPass")}</p>
            <button className="ok-button" onClick={() => setFail(false)}>
              {I18n.getTrans("i.ok")}
            </button>
          </>
        )}
      </div>

      <div className="footer">
        <WifiIcon sx={{ fontSize: 20 }} />
        <AccessibilityNewIcon sx={{ fontSize: 20 }} />
        <PowerSettingsNewIcon sx={{ fontSize: 20 }} />
      </div>
    </div>
  );
}
