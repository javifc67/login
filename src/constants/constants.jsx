export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD",
  usernameRequired: "FALSE",
  avatarImg: "/images/avatar.png",
  backgroundImg: "/images/bg-screen.png",
  actionAfterSolve: "NONE",
  icons: ["power"], //Full list: ["power", "wifi", "accessibility"]
  soundLoginNok: "sounds/failure_login.mp3",
  soundLoginOk: "sounds/succesfull_login.mp3",
};

export const THEMES = {
  STANDARD: "STANDARD"
};

export const THEME_ASSETS = {
  [THEMES.STANDARD]: {}
};

export const ACTION_AFTER_SOLVE = {
  NONE: "NONE",
  SHOW_MESSAGE: "SHOW_MESSAGE",
  SHOW_WEB: "SHOW_WEB",
  SHOW_VIDEO: "SHOW_VIDEO"
}

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const MAIN_SCREEN = "MAIN_SCREEN";
export const VIDEO_SCREEN = "VIDEO_SCREEN";
export const WEB_SCREEN = "WEB_SCREEN";