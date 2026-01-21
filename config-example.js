//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  //usernameRequired: "TRUE", //If "TRUE", user can set the user name.
  //username: "John Doe", //Specify the user name to be displayed.
  //passwordPlaceholder: "Set your password here", //Specify the password placeholder displayed.
  //avatarImg: "/images/avatar.png", //Specify the avatar image URL.
  //backgroundImg: "/images/bg-screen.png", //Background of the login screen.
  //hint: "Enter your PIN to access the system", //Specify a hint message to be displayed when clicking on "I forgot my password".
  actionAfterSolve: "NONE", //actionAfterSolve can be "NONE", "SHOW_MESSAGE", "SHOW_WEB" or "SHOW_VIDEO".
  //message: "Custom message", //Specify a text to be shown after solving the puzzle when actionAfterSolve is "SHOW_MESSAGE".
  //webURL: "https://iglue.dit.upm.es", //Specify a web URL to be opened after solving the puzzle when actionAfterSolve is "SHOW_WEB".
  //videoURL: "", //Specify a video URL to be played after solving the puzzle when actionAfterSolve is "SHOW_VIDEO".

  //Settings that will be automatically specified by the Escapp server
  locale: "es",

  escappClientSettings: {
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
  },
};