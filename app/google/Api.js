"use strict";
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

class GoogleApi {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.createOauth2Client();
  }

  /**
   * Generates the Oauth2GoogleApi client
   */
  createOauth2Client() {
    var credentials = this.req.app.get("config").google;
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    this.oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   */
  authorize() {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token)=> {
      if (err) {
        this.getNewToken();
      } else {
        this.oauth2Client.credentials = JSON.parse(token);
        /**
         * @TODO replace this
         */
        this.processCalendar();
      }
    });
  }

  /**
   * Processes the credentials sent from Google
   */
  processCallbackCredentials() {
    var code = this.req.params.code;
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        this.res.code(500).send('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      this.storeToken(token);
      /**
       * @TODO replace this
       */
      this.processCalendar();
    });
  }

  processCalendar(auth){
    var calendar = google.calendar('v3');
    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var events = response.items;
      if (events.length == 0) {
        console.log('No upcoming events found.');
      } else {
        console.log('Upcoming 10 events:');
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var start = event.start.dateTime || event.start.date;
          console.log('%s - %s', start, event.summary);
        }
      }
    });
  }

  /**
   * Store token to disk be used in later program executions.
   * @param {Object} token The token to store to disk.
   */
  storeToken(token){
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   */
  getNewToken() {
    var authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    this.sendJSON({
      "authUrl": authUrl
    });
  }

  /**
   * Sends a JSON response
   * @param data The data to be sent
   */
  sendJSON(data) {
    this.res.json(data);
  }
}


module.exports = GoogleApi;
