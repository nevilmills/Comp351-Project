let numberOfQuestions = 0
let addedQuestions = 0;
const questionsArray = [];
const storedQuestions = [];
const storedAnswers = [];
const questionObjs = [];
const serverAddress =
"https://www.nevilmills.ca/COMP351/individualprojectserver/";

function Question() {
    this.questionNumber = numberOfQuestions;
    this.numAnswers = 2;
    this.correctAnswer = null;

    //Create HTML elements
    this.questionText = document.createElement("textarea");
    this.questionHeader = document.createElement("h3");
    this.answersHeader = document.createElement("h5");
    this.btnA = document.createElement("input");
    this.btnB = document.createElement("input");
    this.btnC = document.createElement("input");
    this.btnD = document.createElement("input");
    this.textA = document.createElement("input");
    this.textB = document.createElement("input");
    this.textC = document.createElement("input");
    this.textD = document.createElement("input");
    this.questionDiv = document.createElement("div");
    this.choiceDiv = document.createElement("div");

    //Set element attributes
    this.questionDiv.setAttribute("id", "qDiv" + this.questionNumber);
    this.questionDiv.setAttribute("class", "questionDiv");

    this.questionText.setAttribute("rows", "4");
    this.questionText.setAttribute("cols", "40");
    this.questionText.setAttribute("class", "questionTextBox");
    
    this.btnA.setAttribute("type", "radio");
    this.btnA.setAttribute("value", "a");
    this.btnA.setAttribute("name", "btnsQ" + this.questionNumber);
    
    this.btnB.setAttribute("type", "radio");
    this.btnB.setAttribute("value", "b");
    this.btnB.setAttribute("name", "btnsQ" + this.questionNumber);

    this.btnC.setAttribute("type", "radio");
    this.btnC.setAttribute("value", "c");
    this.btnC.setAttribute("name", "btnsQ" + this.questionNumber);

    this.btnD.setAttribute("type", "radio");
    this.btnD.setAttribute("value", "d");
    this.btnD.setAttribute("name", "btnsQ" + this.questionNumber);

    this.textA.setAttribute("type", "text");
    this.textB.setAttribute("type", "text");
    this.textC.setAttribute("type", "text");
    this.textD.setAttribute("type", "text");

    //Set inner HTML
    this.questionHeader.innerHTML = "Question " + this.questionNumber;
    this.answersHeader.innerHTML = "Answers*";

    //Append elements to document
    this.questionDiv.appendChild(this.questionHeader);
    this.questionDiv.appendChild(this.questionText);
    this.questionDiv.appendChild(this.answersHeader);

    this.choiceDiv.appendChild(this.btnA);
    this.choiceDiv.appendChild(this.textA);
    this.choiceDiv.appendChild(document.createElement("BR"));

    this.choiceDiv.appendChild(this.btnB);
    this.choiceDiv.appendChild(this.textB);
    this.choiceDiv.appendChild(document.createElement("BR"));

    this.questionDiv.appendChild(this.choiceDiv);
    document.getElementById("questionsContainer").appendChild(this.questionDiv);

    // Buttons for adding/removing choices
    this.addButton = document.createElement("button");
    this.addButton.setAttribute("type", "button");
    this.addButton.innerHTML = "Add choice";
    this.questionDiv.appendChild(this.addButton);
    this.questionDiv.appendChild(document.createElement("BR"));

    this.btnsArray = [this.btnA, this.btnB, this.btnC, this.btnD];
    this.answersArray = [this.textA, this.textB];

    // Adds choices C or D to questions
    this.addButton.onclick = () => {
        switch(this.numAnswers) {
            case 2:
                this.numAnswers++;
                this.choiceDiv.appendChild(this.btnC);
                this.choiceDiv.appendChild(this.textC);
                this.choiceDiv.appendChild(document.createElement("BR"));
                this.answersArray.push(this.textC);
                break;
            case 3:
                this.numAnswers++;
                this.choiceDiv.appendChild(this.btnD);
                this.choiceDiv.appendChild(this.textD);
                this.choiceDiv.appendChild(document.createElement("BR"));
                this.answersArray.push(this.textD);
                break;
            default: // Give an alert here saying "Maximum choices reached"
                break;
        }
    }

    //Removes the html elements from display.
    this.removeElements = () => {
        this.questionDiv.parentNode.removeChild(this.questionDiv);
    }

}

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

    this.answerA = document.createElement("span");
    this.answerA.setAttribute("class", "incorrect");
    this.answerA.innerHTML = question.answera;
    this.answersDiv.appendChild(this.answerA);
    this.answersDiv.appendChild(document.createElement("br"));

    this.answerB = document.createElement("span");
    this.answerB.setAttribute("class", "incorrect");
    this.answerB.innerHTML = question.answerb;
    this.answersDiv.appendChild(this.answerB);
    this.answersDiv.appendChild(document.createElement("br"));
    
    this.answersArray = [this.answerA, this.answerB];

    if(this.hasC) {
        this.answerC = document.createElement("span");
        this.answerC.setAttribute("class", "incorrect");
        this.answerC.innerHTML = question.answerc;

        this.answersDiv.appendChild(this.answerC);
        this.answersDiv.appendChild(document.createElement("br"));
        this.answersArray.push(this.answerC);
    }

    if(this.hasD) {
        this.answerD = document.createElement("span");
        this.answerD.setAttribute("class", "incorrect");
        this.answerD.innerHTML = question.answerd;

        this.answersDiv.appendChild(this.answerD);
        this.answersDiv.appendChild(document.createElement("br"));
        this.answersArray.push(this.answerD);
    }

    // Create the edit question button
    this.editQ = document.createElement("button");
    this.editQ.setAttribute("type", "button");
    this.editQ.setAttribute("class", "editButton");
    this.editQ.innerHTML = "Edit Question";
    this.subDiv.appendChild(this.editQ);
    //this.questionDiv.appendChild(document.createElement("br"));

    // Sets the correct answer
    this.setCorrectAnswer = () => {
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
    }

    this.createEditableQuestion = () => {
        this.subDiv.appendChild(this.questionHeader);
        this.edittedQuestion = new EdittedQuestion(this);
    }

    this.editQ.onclick = () => {
        while(this.subDiv.firstChild) {
            this.subDiv.removeChild(this.subDiv.lastChild);
        }

        this.createEditableQuestion();
    }
}

function EdittedQuestion(question) {
    this.questionNumber = question.questionNumber;
    this.correctAnswer = question.correctAnswer;
    this.hasC = question.hasC;
    this.hasD = question.hasD;
    this.addedC = false;
    this.addedD = false;
    this.removedC = false;
    this.removedD = false;

    this.newQText = document.createElement("textarea");
    this.newQText.setAttribute("class", "editTextarea");
    this.newQText.value = question.questionText.innerHTML;
    question.subDiv.appendChild(this.newQText);
    question.subDiv.appendChild(document.createElement("br"));

    this.answersDiv = document.createElement("div");
    question.subDiv.appendChild(this.answersDiv);

    this.btnA = document.createElement("input");
    this.btnA.setAttribute("type", "radio");
    this.btnA.setAttribute("name", "btnsQ" + this.questionNumber);
    this.btnA.setAttribute("value", "a");
    this.answersDiv.appendChild(this.btnA);

    this.newAnswerA = document.createElement("input");
    this.newAnswerA.setAttribute("type", "text");
    this.newAnswerA.value = question.answerA.innerHTML;
    this.answersDiv.appendChild(this.newAnswerA);
    this.answersDiv.appendChild(document.createElement("br"));

    this.btnB = document.createElement("input");
    this.btnB.setAttribute("type", "radio");
    this.btnB.setAttribute("name", "btnsQ" + this.questionNumber);
    this.btnB.setAttribute("value", "b");
    this.answersDiv.appendChild(this.btnB);

    this.newAnswerB = document.createElement("input");
    this.newAnswerB.setAttribute("type", "text");
    this.newAnswerB.value = question.answerB.innerHTML;
    this.answersDiv.appendChild(this.newAnswerB);
    this.answersDiv.appendChild(document.createElement("br"));

    this.btnsArray = [this.btnA, this.btnB];
    this.answersArray = [this.newAnswerA, this.newAnswerB];

    if(question.hasC) {
        this.btnC = document.createElement("input");
        this.btnC.setAttribute("type", "radio");
        this.btnC.setAttribute("name", "btnsQ" + this.questionNumber);
        this.btnC.setAttribute("value", "c");
        this.answersDiv.appendChild(this.btnC);
        this.btnsArray.push(this.btnC);

        this.newAnswerC = document.createElement("input");
        this.newAnswerC.setAttribute("type", "text");
        this.newAnswerC.value = question.answerC.innerHTML;
        this.answersDiv.appendChild(this.newAnswerC);
        this.answersDiv.appendChild(document.createElement("br"));
        this.answersArray.push(this.newAnswerC);
    }
    
    if(question.hasD) {
        this.btnD = document.createElement("input");
        this.btnD.setAttribute("type", "radio");
        this.btnD.setAttribute("name", "btnsQ" + this.questionNumber);
        this.btnD.setAttribute("value", "d");
        this.answersDiv.appendChild(this.btnD);
        this.btnsArray.push(this.btnD);

        this.newAnswerD = document.createElement("input");
        this.newAnswerD.setAttribute("type", "text");
        this.newAnswerD.value = question.answerD.innerHTML;
        this.answersDiv.appendChild(this.newAnswerD);
        this.answersDiv.appendChild(document.createElement("br"));
        this.answersArray.push(this.newAnswerD);
    }

    switch(this.correctAnswer) {
        case "a":
            this.btnA.checked = true;
            break;
        case "b":
            this.btnB.checked = true;
            break;
        case "c":
            this.btnC.checked = true;
            break;
        case "d":
            this.btnD.checked = true;
            break;
    }

    this.saveBtn = document.createElement("button");
    this.saveBtn.setAttribute("type", "button");
    this.saveBtn.setAttribute("class", "saveQuestion");
    this.saveBtn.innerHTML = "Save Question";
    question.subDiv.appendChild(this.saveBtn);

    this.addChoiceBtn = document.createElement("button");
    this.addChoiceBtn.setAttribute("type", "button");
    this.addChoiceBtn.setAttribute("class", "addChoice");
    this.addChoiceBtn.innerHTML = "Add Choice";
    question.subDiv.appendChild(this.addChoiceBtn);

    this.removeChoiceBtn = document.createElement("button");
    this.removeChoiceBtn.setAttribute("type", "button");
    this.removeChoiceBtn.setAttribute("class", "removeChoice");
    this.removeChoiceBtn.innerHTML = "Remove Choice";
    question.subDiv.appendChild(this.removeChoiceBtn);

    this.deleteQuestionBtn = document.createElement("button");
    this.deleteQuestionBtn.setAttribute("type", "button");
    this.deleteQuestionBtn.setAttribute("class", "deleteQuestion");
    this.deleteQuestionBtn.innerHTML = "Delete Question";
    question.subDiv.appendChild(this.deleteQuestionBtn);

    this.saveBtn.onclick = () => {
        // Check for empty fields before saving.
        if(this.checkInputs()) {
            return;
        }

        // Update correct answer before sending put request.
        this.correctAnswer = findCheckedButton(this.btnsArray);

        updateQuestion(this);
        console.log("saved");
    }

    this.addChoiceBtn.onclick = () => {
        if(this.hasD) {
            return;
        }

        else if(this.hasC) {
            this.btnD = document.createElement("input");
            this.btnD.setAttribute("type", "radio");
            this.btnD.setAttribute("name", "btnsQ" + this.questionNumber);
            this.btnD.setAttribute("value", "d");
            this.btnsArray.push(this.btnD);

            this.newAnswerD = document.createElement("input");
            this.newAnswerD.setAttribute("type", "text");
            this.newAnswerD.value = "";
            this.answersArray.push(this.newAnswerD);

            this.answersDiv.appendChild(this.btnD);
            this.answersDiv.appendChild(this.newAnswerD);
            this.answersDiv.appendChild(document.createElement("br"));
            this.hasD = true;
            this.addedD = true;
        }

        else {
            this.btnC = document.createElement("input");
            this.btnC.setAttribute("type", "radio");
            this.btnC.setAttribute("name", "btnsQ" + this.questionNumber);
            this.btnC.setAttribute("value", "c");
            this.btnsArray.push(this.btnC);

            this.newAnswerC = document.createElement("input");
            this.newAnswerC.setAttribute("type", "text");
            this.newAnswerC.value = "";
            this.answersArray.push(this.newAnswerC);

            this.answersDiv.appendChild(this.btnC);
            this.answersDiv.appendChild(this.newAnswerC);
            this.answersDiv.appendChild(document.createElement("br"));
            this.hasC = true;
            this.addedC = true;
        }
    }

    this.removeChoiceBtn.onclick = () => {
        if(this.hasD) {
            this.answersDiv.removeChild(this.answersDiv.lastChild);
            this.answersDiv.removeChild(this.btnD);
            this.answersDiv.removeChild(this.newAnswerD);
            this.hasD = false;
            this.addedD = false;
            this.removedD = true;
            this.btnD.checked = false;
            this.answersArray.pop();
        }
        
        else if(this.hasC) {
            this.answersDiv.removeChild(this.answersDiv.lastChild);
            this.answersDiv.removeChild(this.btnC);
            this.answersDiv.removeChild(this.newAnswerC);
            this.hasC = false;
            this.addedC = false;
            this.removedC  =true;
            this.btnC.checked = false;
            this.answersArray.pop();
        }
    }

    this.deleteQuestionBtn.onclick = () => {
        numberOfQuestions--;
        deleteStoredQuestion(this);
        decrementDB(this);
        decrementQuestionNumbers(this.questionNumber);
        refreshQuestionHeaders();
        document.getElementById("questionsContainer").removeChild(question.questionDiv);
    }
    
    // Checks for missing inputs in the question. Used before saving.
    this.checkInputs = () => {
        // Make sure a radio button is checked before submitting to db.
        const btnIsSelected = areBtnsChecked(this.btnsArray);

        if(!btnIsSelected) {
            alert("An answer needs to be selected for the question!");
            return true;;
        }

        if(this.newQText.value === "") {
            alert("Question text is missing!");
            return true;
        }
        
        if(checkForEmptyInputs(this.answersArray)) {
            alert("There is an empty answer field.");
            return true;;
        }
        
        return false;
    }
}

// Returns the value of the checked button from a list of buttons.
findCheckedButton = (btns) => {
    for (let i = 0; i < btns.length; i++) {
        if(btns[i].checked) {
            return btns[i].value;
        }
    }
}

// Sets the correctAnswer attribute for the question objects.
setCorrectAnswers = () => {
    for(let i = 0; i < questionsArray.length; i++) {
        questionsArray[i].correctAnswer = findCheckedButton(questionsArray[i].btnsArray);
    }
}

// Onclick handler for addButton
addQuestion = () => {
    numberOfQuestions++;
    addedQuestions++;
    questionsArray.push(new Question());
}

deleteQuestion = () => {
    if(questionsArray.length === 0) {
        return;
    }
    
    questionsArray[addedQuestions - 1].removeElements();
    questionsArray.pop();

    numberOfQuestions--;
    addedQuestions--;
}

// Determines whether a set of radio buttons contains a checked button.
areBtnsChecked = (btnsArray) => {
    for(let i = 0; i < btnsArray.length; i++) {
        if(btnsArray[i].checked) {
            return true;
        }
    }

    return false;
}

// Determines if there are any empty text input fields in an array.
checkForEmptyInputs = (answersArray) => {
    for(let i = 0; i < answersArray.length; i++) {
        if(answersArray[i].value === "") {
            return true;
        }
    }
    return false;
}

// Alerts the user if any inputs are empty or buttons are unchecked.
checkInputs = () => {
    // Checks for empty answer fields.
    for(let i = 0; i < questionsArray.length; i++) {
        if(checkForEmptyInputs(questionsArray[i].answersArray)) {
            alert("Some answer fields are empty.");
            return true;
        }
    }

    // Check if an answer is selected for each question
    for(let i = 0; i < questionsArray.length; i++) {
        if(!areBtnsChecked(questionsArray[i].btnsArray)) {
            alert("Some answers have not been selected for questions yet.")
            return true;
        }
    }

    // Checks if question texts are missing.
    for(let i = 0; i < questionsArray.length; i++) {
        if(questionsArray[i].questionText.value === "") {
            alert("Some question texts are missing.")
            return true;
        }
    }
    return false;
}

/*
Assign the selected correct answer to each question object.
Perform ajax request, sending values of quiz questions to the db.
 */
saveQuizToDB = () => {
    // If there is an input error, return
    if(checkInputs()) {
        return;
    }
    
    if(addedQuestions === 0) {
        return;
    }
    
    setCorrectAnswers();

    for(let i = 0; i < questionsArray.length; i++) {
        const number = questionsArray[i].questionNumber;
        const text = questionsArray[i].questionText.value;
        const correctAnswer = questionsArray[i].correctAnswer;

        const answerA = questionsArray[i].textA.value;
        const answerB = questionsArray[i].textB.value;
        const answerC = questionsArray[i].textC.value;
        const answerD = questionsArray[i].textD.value;

        const query = "questionnumber=" + number + "&questiontext=" + text +
                        "&correctanswer=" + correctAnswer + "&answera=" + answerA +
                        "&answerb=" + answerB + "&answerc=" + answerC + "&answerd=" +
                        answerD + "&numberofquestions=" + numberOfQuestions +
                        "&type=newquestion";

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", serverAddress, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(query);
        
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                console.log("Entry submitted");
            }
        }
    }
    setTimeout(function() {
        refreshPage();
    }, 500);
}

// Decrements the question number for each question object.
decrementQuestionNumbers = (number) => {
    for(let i = 0; i < storedQuestions.length; i++) {
        if(storedQuestions[i].questionNumber > number) {
            storedQuestions[i].questionNumber--;
        }
    }

    for(let i = 0; i < questionsArray.length; i++) {
        if(questionsArray[i].questionNumber > number) {
            questionsArray[i].questionNumber--;
        }
    }
}

/*
Re-sets the headers for each question after their question numbers are updated
*/
refreshQuestionHeaders = () => {
    for(let i = 0; i < storedQuestions.length; i++) {
        storedQuestions[i].questionHeader.innerHTML = "Question " +
            storedQuestions[i].questionNumber;
    }

    for(let i = 0; i < questionsArray.length; i++) {
        questionsArray[i].questionHeader.innerHTML = "Question " +
            questionsArray[i].questionNumber;
    }
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

// Sends a put request to update a questions values in the db.
updateQuestion = (question) => {
    deleteChoices(question);
    
    if(question.addedC || question.addedD) {
        postNewChoices(question);
    }

    let query = "questionnumber=" + question.questionNumber + "&questiontext=" + question.newQText.value +
                "&correctanswer=" + question.correctAnswer + "&answera=" + question.newAnswerA.value +
                "&answerb=" + question.newAnswerB.value;

    if(question.hasOwnProperty("newAnswerC")) {
        query += "&answerc=" + question.newAnswerC.value;
    }

    if(question.hasOwnProperty("newAnswerD")) {
        query += "&answerd=" + question.newAnswerD.value;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", serverAddress, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(query);
    
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            console.log("Entry updated");
        }
    }
}

// Sends a request to decrement question numbers in the database
decrementDB = (question) => {
    const query = "questionnumber=" + question.questionNumber +
    "&type=decrementnums";

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", serverAddress, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(query);
    
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            console.log("Entry updated");
        }
    }
}

// Creates a post request for when the admin adds choices c/d to a question.
postNewChoices = (question) => {
    const query = "questionnumber=" + question.questionNumber +
    "&type=addchoice";

    if(question.addedC) {
        const queryC = query + "&answerletter=c" + "&answertext=" +
        question.newAnswerC.value;

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", serverAddress, true);
        xhttp.setRequestHeader("Content-type", "text/plain");
        xhttp.send(queryC);
    
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                console.log("Choice Added");
            }
        }
    }

    if(question.addedD) {
        const queryD = query + "&answerletter=d" + "&answertext=" +
        question.newAnswerD.value;

        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", serverAddress, true);
        xhttp.setRequestHeader("Content-type", "text/plain");
        xhttp.send(queryD);
    
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                console.log("Choice Added");
            }
        }
    }
}

// Sends a request to delete choice c or d from the database
deleteChoices = (question) => {
    if(question.removedC) {
        // Send delete request to remove C
        const query = "questionnumber=" + question.questionNumber +
                      "&answerletter=c&type=choice";
        
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", serverAddress, true);
        xhttp.setRequestHeader("Content-type", "text/plain");
        xhttp.send(query);
        
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                console.log("Choice deleted");
            }
        }
    }

    if(question.removedD) {
        const query = "questionnumber=" + question.questionNumber +
                      "&answerletter=d&type=choice";

        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", serverAddress, true);
        xhttp.setRequestHeader("Content-type", "text/plain");
        xhttp.send(query);
        
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                console.log("Choice deleted");
            }
        }
    }
}

// Sends a request to delete a question from the database.
deleteStoredQuestion = (question) => {
    const query = "questionnumber=" + question.questionNumber +
                "&type=question";

    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", serverAddress, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(query);
    
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            console.log("Question deleted");
        }
    }
}

displayRetrievedQuestions = () => {
    for(let i = 0; i < questionObjs.length; i++) {
        console.log(questionObjs[i]);
    }
}

createStoredQuestions = () => {
    for(let i = 0; i < questionObjs.length; i++) {
        storedQuestions.push(new StoredQuestion(questionObjs[i]));
    }

    for(let i = 0; i < storedQuestions.length; i++) {
        storedQuestions[i].setCorrectAnswer();
    }

    numberOfQuestions = storedQuestions.length;
}

refreshPage = () => {
    window.location.reload();
}

onloadHandler = () => {
    retrieveQuestions();
    retrieveAnswers();

    setTimeout(function() {
        createStoredQuestions();
        if(storedQuestions.length === 0) {
            alert("There are no questions currently stored in the database.");
        }
    }, 500);
}

window.onload = onloadHandler;

document.getElementById("addButton").onclick = addQuestion;
document.getElementById("deleteButton").onclick = deleteQuestion;
document.getElementById("saveButton").onclick = saveQuizToDB;
