const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

function sendMessage(message, user) {
    admin
        .messaging()
        .sendToDevice(user.tokens.slice(-1)[0], message)
        .then(function (response) {
            console.log('Notification sent successfully:', response);
        })
        .catch(function (error) {
            console.log('Notification sent failed:', error);
        });
}

exports.createUser = functions.firestore.document('users/{uid}').onCreate(event => {
    const user = event.data();
    const message = {
        data: {
            user: JSON.stringify(user)
        }
    };
    sendMessage(message, user);
    return true;
});

exports.updateTodo = functions.firestore.document('todos/{todoId}').onUpdate(event => {
    const user = event.data();
    const message = {
        data: {
            user: JSON.stringify(user)
        }
    };
    sendMessage(message, user);
    return true;
});
