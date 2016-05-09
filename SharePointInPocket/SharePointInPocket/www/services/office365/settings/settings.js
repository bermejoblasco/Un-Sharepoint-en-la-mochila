var O365Auth;
(function (O365Auth) {
    (function (Settings) {
        Settings.clientId = 'yourClientId';
        Settings.authUri = 'https://login.microsoftonline.com/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
        Settings.domain = 'yourOffice365domain';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));
