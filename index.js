import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, push, set,onValue} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
        apiKey: "AIzaSyB54rMo9k-zgp2eRoThQxooySKsNzRonUM",
        authDomain: "classcraft-6be34.firebaseapp.com",
        projectId: "classcraft-6be34",
        databaseURL: "https://classcraft-6be34-default-rtdb.asia-southeast1.firebasedatabase.app",
        storageBucket: "classcraft-6be34.appspot.com",
        messagingSenderId: "945811480596",
        appId: "1:945811480596:web:604a3f32d46a9427f30701",
        measurementId: "G-3KM6RDH8SH"
        };

//loading keyframe animation (working)
//disable inspect element
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);
document.addEventListener("keydown", function(e){
    if(e.key == "F12"){
        e.preventDefault();
    }
})
let anschecker = false

document.onkeydown = (e) => {
    if (e.key == 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'I') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'C') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'J') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key == 'U') {
        e.preventDefault();
    }
};
document.addEventListener('keypress', function (event) {
    if (event.metaKey && event.altKey && event.key === 'c') {
        event.preventDefault()
    }
});
document.addEventListener('copy', function (event) {
    event.preventDefault(); // Prevent the default copy behavior
    if (event.clipboardData) {
        event.clipboardData.setData('text/plain', getSelection().toString());

    }});
const app = initializeApp(firebaseConfig);
let score = 0;
document.getElementById("scoresub").style.display = "none";
const analytics = getAnalytics(app);
const database = getDatabase();
let anscount = 0;
document.getElementById("quizgo").style.display = "none";
document.getElementById("finish").style.display = "none";
let loaded = false;
let answeredQuestions = 0;
function getQuiz(){
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/quiz');
    onValue(dbRef, (snapshot) => {
     snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData.answer);
        console.log(childData.question);
        loaded = true;

  });
}, {
  onlyOnce: true
});
}
let newParagraph = '' ;
function getData(){
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/data');

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData);
        newParagraph = document.createElement('p');
        newParagraph.innerHTML = childData.data;
        newParagraph.style.textAlign = "center";
        document.body.appendChild(newParagraph);
        document.getElementById("classcode").style.display = "none";
        document.getElementById("go").style.display = "none";
        document.getElementById("quizgo").addEventListener("click", function(){
            newParagraph.style.display = "none";    
        })
  });
}, {
  onlyOnce: true
});
}

document.getElementById("go").addEventListener("click", function(){
    console.log(loaded)
    document.getElementById("typed-text").style.display = "none";
        const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/data');
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if(childData != null){
                    console.log("exists");
                    getData();
                    console.log(childData);
                    getQuiz();
                    document.getElementById("quizgo").style.display = "block";
                    console.log(document.getElementById("classcode").length);

                }
                else{
                    window.alert("Class code does not exist");
                    console.log(childData);
                }
                console.log(childData);
                // ...
            });
        }, {
            onlyOnce: true
        })

});

document.getElementById("classcode").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        if(document.getElementById("classcode").value.length != 0){
            getData();
            getQuiz();
            document.getElementById("quizgo").style.display = "block";
            console.log(document.getElementById("classcode").length);
        }
        else{
            window.alert("Enter class code");
        }
    }
});
document.getElementById("quizgo").addEventListener("click", function(){
    let info = document.createElement("h2");
    info.innerHTML = "Answer the question below and press enter or click check to check every answer , do not finish without answering all questions";
    info.style.textAlign = "center";
    document.body.appendChild(info);
    document.getElementById("finish").addEventListener("click" , ()=>{
        info.style.display = "none";
    
    })
    let cdanswer;
    let cdquestion;
    let ck
    const dbRef = ref(database, 'room/' + document.getElementById('classcode').value + '/quiz');
    onValue(dbRef, (snapshot) => {
     snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey);
        console.log(childData.answer);
        console.log(childData.question);
        let newq = document.createElement("h2")
        let ansbox = document.createElement("input");
        ansbox.className = "ansbox";
        let check = document.createElement("button");
        check.innerHTML = "Check";
        ansbox.style.textAlign = "center";
        newq.innerHTML = childData.question;
        document.body.appendChild(newq);
        document.body.appendChild(ansbox);
        document.body.appendChild(check);
        document.getElementById("quizgo").style.display = "none";
        document.getElementById("finish").style.display = "block";
        anscount = ansbox
        check.addEventListener("click", function(){
            answeredQuestions = answeredQuestions + 1;
            console.log("Check button clicked");
            console.log( "Question" + childData.question +" Answer " + ansbox.value);
            if(ansbox.value == childData.answer){
                window.alert("Correct");
                score = score + 1;
                ansbox.disabled = true;
                check.disabled = true;
            }
            else{
                window.alert("Incorrect");
                ansbox.disabled = true;
                check.disabled = true;  
            }
        })
        ansbox.addEventListener("keypress" , (e)=>{
            if(e.key === "Enter"){
                answeredQuestions = answeredQuestions + 1;
                console.log("Enter key pressed");
                console.log( "Question" + childData.question +" Answer " + ansbox.value);
                if(ansbox.value == childData.answer){
                    window.alert("Correct");
                    score = score + 1;
                    ansbox.disabled = true;
                    check.disabled = true;
                }
                else{
                    window.alert("Incorrect");
                    ansbox.disabled = true;
                    check.disabled = true;  
                }
            }

        })
        document.getElementById("finish").addEventListener("click", function(){
            if(anschecker == true){
                newq.style.display = "none";
                ansbox.style.display = "none";
                check.style.display = "none";
            }else{
                console.error('error')
            }

        })
  });
}, {
  onlyOnce: true
});
document.getElementById("finish").addEventListener("click", function(){
    const numberOfAnsboxes = document.querySelectorAll('.ansbox').length;
    if(answeredQuestions == numberOfAnsboxes){
        anschecker = true;
        document.getElementById("finish").style.display = "none";
        let nameinp = document.createElement("input");
        let scoreshow = document.createElement("h2");
        scoreshow.innerHTML = "Score: " + score + "/" + numberOfAnsboxes;
        nameinp.placeholder = "Enter name";
        let submitsocre = document.createElement("button");
        submitsocre.innerHTML = "Submit Score";
        let br = document.createElement("br");
        document.body.appendChild(scoreshow);
        document.body.appendChild(br);
        document.body.appendChild(br);
        document.body.appendChild(nameinp);
        document.body.appendChild(br);
        document.body.appendChild(br);
        document.body.appendChild(submitsocre);
        submitsocre.addEventListener("click", function(){
            const postListRef = ref(database, 'scores/' + document.getElementById('classcode').value + '/name '  );
            const newPostRef = push(postListRef);
            set(newPostRef, {
                name: nameinp.value,
                "score": score + "/" + numberOfAnsboxes,
                "percentage": score/numberOfAnsboxes * 100 + "%"
            });
            nameinp.style.display = "none";
            submitsocre.style.display = "none";
            scoreshow.style.display = "none";
            let showmess = document.createElement("h1").innerHTML = "Score submitted";
            document.getElementById("scoresub").style.display = "block";
        })

    }
    else{
        window.alert("Answer all questions!");
    }

})
});
let text = 'Ready to start?' + '\n' + '\nEnter class code and press enter or click go to start';
let index = 0;
function type() {
    if (index < text.length) {
        document.getElementById('typed-text').innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100); // Adjust the speed of typing here, lower values will type faster
    }
}
type();
document.getElementById("go").addEventListener("click", function(){
    document.getElementById("typed-text").style.display = "none";
});
document.getElementById("classcode").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        document.getElementById("typed-text").style.display = "none";
    }
})
