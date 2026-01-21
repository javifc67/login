import { useContext, useEffect, useRef, useState } from "react";
import "./../assets/scss/app.scss";

import {
  ACTION_AFTER_SOLVE,
  DEFAULT_APP_SETTINGS,
  ESCAPP_CLIENT_SETTINGS,
  MAIN_SCREEN,
  THEME_ASSETS,
  WEB_SCREEN,
  VIDEO_SCREEN,
} from "../constants/constants.jsx";
import { GlobalContext } from "./GlobalContext.jsx";
import MainScreen from "./MainScreen.jsx";

export default function App() {
  const { escapp, setEscapp, appSettings, setAppSettings, Storage, setStorage, Utils, I18n } = useContext(GlobalContext);
  const hasExecutedEscappValidation = useRef(false);

  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(MAIN_SCREEN);
  const prevScreen = useRef(screen);
  const [solved, setSolved] = useState(false);
  const [solvedTrigger, setSolvedTrigger] = useState(0);

  useEffect(() => {
    //Init Escapp client
    if (escapp !== null) {
      return;
    }
    //Create the Escapp client instance.
    let _escapp = new ESCAPP(ESCAPP_CLIENT_SETTINGS);
    setEscapp(_escapp);
    Utils.log("Escapp client initiated with settings:", _escapp.getSettings());

    //Use the storage feature provided by Escapp client.
    setStorage(_escapp.getStorage());

    //Get app settings provided by the Escapp server.
    let _appSettings = processAppSettings(_escapp.getAppSettings());
    setAppSettings(_appSettings);
  }, []);

  useEffect(() => {
    if (!hasExecutedEscappValidation.current && escapp !== null && appSettings !== null && Storage !== null) {
      hasExecutedEscappValidation.current = true;

      //Register callbacks in Escapp client and validate user.
      escapp.registerCallback("onNewErStateCallback", function (erState) {
        try {
          Utils.log("New escape room state received from ESCAPP", erState);
          restoreAppState(erState);
        } catch (e) {
          Utils.log("Error in onNewErStateCallback", e);
        }
      });

      escapp.registerCallback("onErRestartCallback", function (erState) {
        try {
          Utils.log("Escape Room has been restarted.", erState);
          if (typeof Storage !== "undefined") {
            Storage.removeSetting("state");
          }
        } catch (e) {
          Utils.log("Error in onErRestartCallback", e);
        }
      });

      //Validate user. To be valid, a user must be authenticated and a participant of the escape room.
      escapp.validate((success, erState) => {
        try {
          Utils.log("ESCAPP validation", success, erState);
          if (success) {
            restoreAppState(erState);
            setLoading(false);
          }
        } catch (e) {
          Utils.log("Error in validate callback", e);
        }
      });
    }
  }, [escapp, appSettings, Storage]);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      Utils.log("Screen has changed from", prevScreen.current, "to", screen);
      prevScreen.current = screen;
    }
  }, [screen]);

  function restoreAppState(erState) {
    Utils.log("Restore application state based on escape room state:", erState);
    if (escapp.getAllPuzzlesSolved() && (escapp.getSolvedPuzzles().length > 0)){
      if (appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.SHOW_WEB) {
        setSolved(true);
        setScreen(WEB_SCREEN);
      }
    }
  }

  function processAppSettings(_appSettings) {
    if (typeof _appSettings !== "object") {
      _appSettings = {};
    }
    _appSettings.usernameRequired = (_appSettings.usernameRequired === true || _appSettings.usernameRequired === "TRUE");
    if (typeof _appSettings.skin === "undefined" && typeof DEFAULT_APP_SETTINGS.skin === "string") {
      _appSettings.skin = DEFAULT_APP_SETTINGS.skin;
    }

    let skinSettings = THEME_ASSETS[_appSettings.skin] || {};
    let DEFAULT_APP_SETTINGS_SKIN = Utils.deepMerge(DEFAULT_APP_SETTINGS, skinSettings);

    // Merge _appSettings with DEFAULT_APP_SETTINGS_SKIN to obtain final app settings
    _appSettings = Utils.deepMerge(DEFAULT_APP_SETTINGS_SKIN, _appSettings);
    
    //Init internacionalization module
    I18n.init(_appSettings);

    if (typeof _appSettings.username !== "string") {
      if(_appSettings.usernameRequired === false){
        _appSettings.username = I18n.getTrans("i.username_default");
      } else {
        _appSettings.username = "";
      }
    }
    if (typeof _appSettings.passwordPlaceholder !== "string") {
      _appSettings.passwordPlaceholder = I18n.getTrans("i.password_placeholder");
    }

    if ((typeof _appSettings.message !== "string") || (_appSettings.message.trim()==="")) {
      _appSettings.message = I18n.getTrans("i.successfulLogin");
    }
    
    //Check actions
    if (_appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.SHOW_VIDEO) {
      if (typeof _appSettings.videoURL !== "string") {
        _appSettings.actionAfterSolve = "NONE";
      } else {
        Utils.preloadVideos([_appSettings.videoURL]);
      }
    }

    if ((_appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.SHOW_WEB) && (typeof _appSettings.webURL !== "string")) {
      _appSettings.actionAfterSolve = "NONE";
    }

    //Change HTTP protocol to HTTPs in URLs if necessary
    _appSettings = Utils.checkUrlProtocols(_appSettings);

    //Preload resources (if necessary)
    Utils.preloadImages([_appSettings.backgroundMessage]);
    //Utils.preloadAudios([_appSettings.soundBeep,_appSettings.soundNok,_appSettings.soundOk]); //Preload done through HTML audio tags
    //Utils.preloadVideos(["videos/some_video.mp4"]);
    Utils.log("App settings:", _appSettings);
    return _appSettings;
  }

  function solvePuzzle(_solution) {
    Utils.log("solution: ", _solution);
    return checkResult(_solution);
  }

  function checkResult(_solution) {
    escapp.checkNextPuzzle(_solution, {}, (success, erState) => {
      Utils.log("Check solution Escapp response", success, erState);
      if (success) {
        setSolved(true);
        document.getElementById("audio_success").play(); //Play success audio
        if (appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.NONE) {
          submitPuzzleSolution(_solution);
        } else if (appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.SHOW_WEB) {
          setScreen(WEB_SCREEN);
          submitPuzzleSolution(_solution);
        } else if (appSettings.actionAfterSolve === ACTION_AFTER_SOLVE.SHOW_VIDEO) {
          setScreen(VIDEO_SCREEN);
          setTimeout(function(){
            let video = document.getElementById("video");
            video.play();
            video.addEventListener("ended", () => {
              submitPuzzleSolution(_solution);
            });
          },0);
        }
      } else {
        setSolvedTrigger((prev) => prev + 1);
      }
    });
  }

  function submitPuzzleSolution(_solution) {
    Utils.log("Submit puzzle solution", _solution);
    escapp.submitNextPuzzle(_solution, {}, (success, erState) => {
      Utils.log("Solution submitted to Escapp", _solution, success, erState);
    });
  }

  const renderScreens = (screens) => {
    if (loading === true) {
      return null;
    } else {
      return <>{screens.map(({ id, content }) => renderScreen(id, content))}</>;
    }
  };

  const renderScreen = (screenId, screenContent) => (
    <div key={screenId} className={`screen_wrapper ${screen === screenId ? "active" : ""}`}>
      {screenContent}
    </div>
  );

  let screens = [
    {
      id: MAIN_SCREEN,
      content: (
        <div
          className="main-background"
          style={{
            backgroundImage: appSettings?.backgroundImg ? `url(${appSettings.backgroundImg})` : {},
            height: " 100%",
            width: "100%",
          }}
        >
          <MainScreen solvePuzzle={solvePuzzle} submitPuzzleSolution={submitPuzzleSolution} solved={solved} solvedTrigger={solvedTrigger} />
        </div>
      ),
    },
    {
      id: VIDEO_SCREEN,
      content: (
        <video
          id="video"
          src={appSettings?.videoURL}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ),
    },
    {
      id: WEB_SCREEN,
      content: (
        <iframe
          src={appSettings?.webURL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            border: "none",
          }}
        />
      ),
    },
  ];

  return (
    <div
      id="global_wrapper"
      className={`${appSettings !== null && typeof appSettings.skin === "string" ? appSettings.skin.toLowerCase() : ""
        }`}
    >
      {renderScreens(screens)}
    </div>
  );
}