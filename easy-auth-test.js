console.log("Starting authenticatorTest.js");

// Test Data
validUserAndPassword = [
    {user: "johndoe", pwd: "feai2@fe A"},
    {user: "fa12f", pwd: "not empty"},
    {user: "z123", pwd: "23nf 2fa"},
    {user: "k", pwd: "lots of spaces"}
];

invalidUserNames = ["1", "1Afea", // starts with number
                    " ", " fea", "\n", "\t", // starts with whitespace
                    "F1 ", "f21 \n", // ends with whitespace
                    "fe_fea", "?fea", "?", ",", "=" // special characters
];

invalidPassword = [
    {user: "emptyPassword", pwd: ""}, // empty password
    {user: "tooShortPassword", pwd: "123"} // too short
];

// Create app object

var auth = require("./easy-auth");

// create new password db
auth.create();
for (var i = 0; i < validUserAndPassword.length; i++) {
    auth.add(validUserAndPassword[i].user, validUserAndPassword[i].pwd);
}

// Test users in database with correct password
console.log("Checking user with correct password")
for (var i = 0; i < validUserAndPassword.length; i++) {
    var result = auth.check(validUserAndPassword[i].user, validUserAndPassword[i].pwd);
    console.log(validUserAndPassword[i].user + "\t" + result);
}

// Test users in database with incorrect password
console.log("Checking user with incorrect password")
for (var i = 0; i < validUserAndPassword.length; i++) {
    var result = auth.check(validUserAndPassword[i].user, validUserAndPassword[i].pwd + "dummy");
    console.log(validUserAndPassword[i].user + "\t" + result);
}

// Try to add users with invalid user names
console.log("Checking user with invalid user names")
for (var i = 0; i < invalidUserNames.length; i++) {
    try {
        auth.add(invalidUserNames[i], "password not relevant");
    } catch (e) {
        console.log(i + ": " + "\t" + e.name + " -> " + e.message);
    }
} 
// Try to add users with invalid passwords
console.log("Checking user with invalid passwords")
for (var i = 0; i < invalidPassword.length; i++) {
    try {
        auth.add(invalidPassword[i].user, invalidPassword[i].pwd);
    } catch (e) {
        console.log(i + ") " + invalidPassword[i].user + ": " + "\t" + e.name + " -> " + e.message);
    }
} 
auth.printDB();