const csurf = require('csurf');

// uses the session to store the secret, so express-session must be set up before this runs
const csrf = csurf();

module.exports = csrf;
