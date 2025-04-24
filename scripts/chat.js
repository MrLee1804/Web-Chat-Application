const inputText = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const box = document.getElementById('msgBox');
var user = document.getElementById('user');

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIhrHatdUWSUDUG6i4Bv2MurWqtyoxHro",
  authDomain: "blog-web-f8396.firebaseapp.com",
  databaseURL: "https://blog-web-f8396-default-rtdb.firebaseio.com",
  projectId: "blog-web-f8396",
  storageBucket: "blog-web-f8396.firebasestorage.app",
  messagingSenderId: "564793911422",
  appId: "1:564793911422:web:a4e707391285f99086d02f",
  measurementId: "G-LV49ZYBQZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var sender;

function Gettime() {
    var d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    month = d.getMonth(),
    mon = months[month],
    y = d.getFullYear(),
    dt = d.getDate();
    
    if(h > 12) { h = h - 12 }
    if(h < 10) { h = "0" + h }
    if(m < 10) { m = "0" + m }
    if(s < 10) { s = "0" + s }
    
    return mon + " " + dt + ", " + y + "  " + h + ":" + m + ":" + s
}

if(sessionStorage.getItem('sender')) {
    sender = sessionStorage.getItem('sender');
} else {
    sender = prompt("Enter your name: ")
    sessionStorage.setItem('sender', sender);
}

user.innerText = sender

module.sendMsg = function sendText() {
    var timeStamp = new Date().getTime();
    var time = Gettime()
    set(ref(db, "ChatMessage/" + timeStamp), {
        sender: sender,
        text: inputText.value,
        time: time
    })
    inputText.value = ""
}

onChildAdded(ref(db, "ChatMessage"), (data) => {
    if(data.val().sender == sender) {
        var time = data.val().time.split('2025 ')
        time = time[1]
        console.log(time)
        box.innerHTML += "<div id= " + data.key + " class='justify-content-end mt-3 d-flex'><div class='bg-primary text-white fs-5 p-2 rounded-3'>" + data.val().text + "<button class='btn btn-primary' id=dltMsg onclick=module.dltMsg(" + data.key + ")><i class='bi bi-trash'></i></button></div></div>"
    }
    else {
        box.innerHTML += "<div id= " + data.key + " class='mt-3 d-flex'><div class='bg-white fs-5 p-2 rounded-3'>" + data.val().text + "</div></div>"
    }
})

module.dltMsg = function dltMsg(key) {
    remove(ref(db, "ChatMessage/" + key));
}

onChildRemoved(ref(db, "ChatMessage"), (data) => {
    var msg = document.getElementById(data.key);
    box.removeChild(msg)
})
