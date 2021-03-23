let numberOfQuestions = null;
let correctQuestions = 0;
const storedQuestions = [];
const questionObjs = [];
const serverAddress =
"https://www.nevilmills.ca/COMP351/individualprojectserver/";

const scoreMsg = document.createElement("h4");
scoreMsg.setAttribute("id", "scoreMsg");
document.getElementById("messageContainer").appendChild(scoreMsg);

// Object representing the stored questions that were retrieved from db.
function StoredQuestion(question) {
    this.questionNumber = question.questionnumber;
    this.correctAnswer = question.correctanswer;
    this.hasC = false;
    this.hasD = false;

    if(question.hasOwnProperty("answerc")) {
        this.hasC = true;
    }

    if(question.hasOwnProperty("answerd")) {
        this.hasD = true;
    }

    // Create HTML elements
    this.questionDiv = document.createElement("div");
    this.questionDiv.setAttribute("id", "question" + this.questionNumber);
    this.questionDiv.setAttribute("class", "questionDiv" + this.questionNumber);
    document.getElementById("questionsContainer").appendChild(this.questionDiv);

    this.subDiv = document.createElement("div");
    this.questionDiv.appendChild(this.subDiv);

    this.questionHeader = document.createElement("h3");
    this.questionHeader.innerHTML = "Question " + this.questionNumber;
    this.subDiv.appendChild(this.questionHeader);

    this.questionText = document.createElement("p");
    this.questionText.setAttribute("class", "storedText");
    this.questionText.innerHTML = question.questiontext;
    this.subDiv.appendChild(this.questionText);

    this.answersDiv = document.createElement("div");
    this.subDiv.appendChild(this.answersDiv);

    this.btnA = document.createElement("input");
    this.btnA.setAttribute("type", "radio");
    this.btnA.setAttribute("name", "btnsQ" + this.questionNumber);
    this.btnA.setAttribute("value", "a");
    this.answersDiv.appendChild(this.btnA);

    this.answerA = document.createElement("span");
    this.answerA.setAttribute("class", "incorrect");
    this.answerA.innerHTML = question.answera;
    this.answersDiv.appendChild(this.answerA);
    this.answersDiv.appendChild(document.createElement("br"));

    this.btnB = document.createElement("input");
    this.btnB.setAttribute("type", "radio");
    this.btnB.setAttribute("name", "btnsQ" + this.questionNumber);
    this.btnB.setAttribute("value", "b");
    this.answersDiv.appendChild(this.btnB);

    this.answerB = document.createElement("span");
    this.answerB.setAttribute("class", "incorrect");
    this.answerB.innerHTML = question.answerb;
    this.answersDiv.appendChild(this.answerB);
    this.answersDiv.appendChild(document.createElement("br"));

    this.btnsArray = [this.btnA, this.btnB];


    if(this.hasC) {
        this.btnC = document.createElement("input");
        this.btnC.setAttribute("type", "radio");
        this.btnC.setAttribute("name", "btnsQ" + this.questionNumber);
        this.btnC.setAttribute("value", "c");
        this.answersDiv.appendChild(this.btnC);
        this.btnsArray.push(this.btnC);

        this.answerC = document.createElement("span");
        this.answerC.setAttribute("class", "incorrect");
        this.answerC.innerHTML = question.answerc;

        this.answersDiv.appendChild(this.answerC);
        this.answersDiv.appendChild(document.createElement("br"));
    }

    if(this.hasD) {
        this.btnD = document.createElement("input");
        this.btnD.setAttribute("type", "radio");
        this.btnD.setAttribute("name", "btnsQ" + this.questionNumber);
        this.btnD.setAttribute("value", "d");
        this.answersDiv.appendChild(this.btnD);
        this.btnsArray.push(this.btnD);

        this.answerD = document.createElement("span");
        this.answerD.setAttribute("class", "incorrect");
        this.answerD.innerHTML = question.answerd;

        this.answersDiv.appendChild(this.answerD);
        this.answersDiv.appendChild(document.createElement("br"));
    }

    // Sets the correct answer | This should later be moved to the "submit quiz" button onclick function
    /*this.setCorrectAnswer = () => {
        switch(this.correctAnswer) {
            case "a":
                this.answerA.setAttribute("class", "correct");
                break;
            case "b":
                this.answerB.setAttribute("class", "correct");
                break;
            case "c":
                this.answerC.setAttribute("class", "correct");
                break;
            case "d":
                this.answerD.setAttribute("class", "correct");
                break;
        }
    }*/
}

// Returns the stored questions from db as an array of JSON objects
retrieveQuestions = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", serverAddress + "?req=question", true);
    xhttp.send();
    let result = null;
    
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);

            for(let i = 0; i < result.length; i++) {
                questionObjs.push(result[i]);
            }
        }
    }
}

retrieveAnswers = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", serverAddress + "?req=answer", true);
    xhttp.send();
    let result = null;
    
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            result = JSON.parse(this.responseText);
            console.log(result);

            for(let i = 0; i < result.length; i++) {
                const qNum = parseInt(result[i].questionnumber);
                const letter = result[i].answerletter;
                const attr = "answer" + letter;
                const answerText = result[i].answertext;

                questionObjs[qNum - 1][attr] = answerText;
            }
        }
    }
}

createQuestions = () => {
    for(let i = 0; i < questionObjs.length; i++) {
        storedQuestions.push(new StoredQuestion(questionObjs[i]));
    }
    /*
    for(let i = 0; i < storedQuestions.length; i++) {
        storedQuestions[i].setCorrectAnswer();
    }*/

    numberOfQuestions = storedQuestions.length;
}

displayScore = () => {
    scoreMsg.innerHTML = "Score: " + correctQuestions + "/" + numberOfQuestions;
}

document.getElementById("submitBtn").onclick = () => {
    if(storedQuestions.length === 0) {
            return;
        }
    
    for(let i = 0; i < storedQuestions.length; i++) {
        for(let j = 0; j < storedQuestions[i].btnsArray.length; j++) {
            let letter = null;

            if(storedQuestions[i].btnsArray[j].checked) {
                letter = storedQuestions[i].btnsArray[j].value;

                if(letter === storedQuestions[i].correctAnswer) {
                    correctQuestions++;
                }
            }
        }
    }

    displayScore();
    correctQuestions = 0;
}

onloadHandler = () => {
    retrieveQuestions();
    retrieveAnswers();

    setTimeout(function() {
        createQuestions();
        if(storedQuestions.length === 0) {
            alert("There are no questions currently stored in the database.");
        }
    }, 500);
}

window.onload = onloadHandler;