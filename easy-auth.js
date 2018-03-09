// This is the Authenticator module
// It provides the following functions:
// 1. Create new password database, with optional encryption key
// 2. Add new user and password
// 3. Remove existing user and associated password
// 4. Reset password for existing user
// 5. Remove all users and password
//
// The following security feature are provided:
// 1. Key to encrypt/decrypt password database
// 2. Salt for hashing function
// 3. Optional time out after m attempts in n seconds
// 4. Optional lockout after m attempts in n seconds
var crypto = require("bcrypt");

var authenticator = function (key) {
    var app = {};   // app object to be returned at end
    var db = null;  // holds the password database object
    var dbExists = false; // true if password database object has been created
    var allowEmptyPassword = false; // by default, don't allow for empty password
    var minPasswordLength = 6; // password must be at least 6 characters long
    var allowedUserNameRegex = /^[a-z]+[0-9a-z]*$/i; // User name must start with letter, and consist of only alphanumerical characters

    // Bind private functions to public app object
    app.check = check;
    app.create = create;
    app.add = add;
    app.remove = remove;
    app.removeAll = removeAll;

    app.printDB = function () {
        for (var user in db) {
            if (db.hasOwnProperty(user)) {
                console.log(user + " : " + db[user]);
            }
        }
    }

    // Verify user password
    function check(user, pwd) {
        // Reject non-string parameters
        if (typeof user !== "string" || typeof pwd !== "string") {
            console.log("authenticator.check(): user name or password are not string type");
            return false;
        }
        // Reject user name that doesn't pass regex
        if (!allowedUserNameRegex.test(user)) {
            console.log("authenticator.check(): User name " + user + " failed regex check");
            return false;
        }
        // Check password
        return hash(pwd) === db[user];
    }


    // Create new password database. Do nothing if the database already exists
    function create() {
        if (!db) {
            db = {};    // create new object as the database if it is "emtpy"
            dbExists = true;
            return true;
        } else {
            return false;
        }
    }

    // Add new user and password
    function add(user, pwd) {
      var error;
        if (dbExists) {
            // Check for type of user and password
            if (user && typeof user !== "string") {
                error = {};
                error.name = "Type Error";
                error.message = "authenticator.add(): User name is not of type string";
                throw error;
            }
            // Reject user name that doesn't pass regex
            if (!allowedUserNameRegex.test(user)) {
                console.log("User name " + user + " failed regex check");
                error = {};
                error.name = "Value Error";
                error.message = "authenticator.add(): User name " + user + " failed regex check";
                throw error;
            }
            if (pwd && typeof pwd !== "string") {
                error = {};
                error.name = "Type Error";
                error.message = "authenticator.add(): User password is not of type string";
                throw error;
            }
            if (pwd.length < minPasswordLength) {
                error = {};
                error.name = "Value Error";
                error.message = "authenticator.add(): User password must be at least " + minPasswordLength + " characters";
                throw error;
            }
            // Make sure user isn't already in the database
            if (db.hasOwnProperty(user)) {
                error = {};
                error.name = "Access Error";
                error.message = "authenticator.add(): User " + user + " already exists in the database";
                throw error;
            }
            // Make sure pwd is not empty
            if (!allowEmptyPassword && pwd === "") {
                error = {};
                error.name = "Value Error";
                error.message = "authenticator.add(): Password for user " + user + " cannot be empty";
                throw error;
            }
            // Add the user to db
            db[user] = hash(pwd);
        } else {
            throw {name: "Access error", message: "authenticator.add(): Password database has not been created."};
        }
    }

    // Remove existing user and password
    function remove(user) {
        if (dbExists) {
            if (typeof user === "string" && user !== "") {
                delete db[user];
            } else {
                var error = {};
                error.name = typeof user !== "string" ? "Type Error" : "Value Error";
                error.message = "User name cannot be empty when deleting from password database";
            }
        } else {
            throw {name: "Access error", message: "Password database has not been created."};
        }
    }

    // Clear user database
    function removeAll(confirmation) {
        if (confirmation === true) {
            db = null;
        }
    }
    // Helper functions
    function hash(pwd) {
        // returns password hash
        // TODO: implement
        return pwd;
    }
    
    return app;
}

module.exports = authenticator();
