const http = require('http');
const url = require('url');
const mysql = require('mysql');
const qs = require('querystring');

const db = mysql.createConnection({
    host: "localhost",
    user: "nevilmil_nodemysql",
    password: "nodemysql321",
    database: "nevilmil_nodemysql"
});

http.createServer(function (request, response) {
    response.writeHead(200, {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE"
    });

    if (request.method === "GET") {
        let q = url.parse(request.url, true);

        retrieveEntries(response, q);
    }

    else if(request.method === "POST") {
        let body = "";
        //response.end();

        request.on("data", function(data) {
            body += data;

            if(body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on("end", function() {
            let post = qs.parse(body);
            post.questionnumber = parseInt(post.questionnumber);
            post.numberofquestions = parseInt(post.numberofquestions);

            if(post.type === "addchoice") {
                insertNewChoices(post);
            }

            if(post.type === "newquestion") {
                insertEntries(post);
            }

            response.end();
        });
    }

    else if(request.method === "PUT") {
        let body = "";

        request.on("data", function(data) {
            body += data;

            if(body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on("end", function() {
            let put = qs.parse(body);
            put.questionnumber = parseInt(put.questionnumber);
            
            console.log("PUT request");

            if(put.type === "decrementnums") {
                decrementQuestionNumbers(put);
                response.end();
            }

            else {
                updateEntry(put);
            }
        });
    }

    else if(request.method === "DELETE") {
        let body = "";

        request.on("data", function(data) {
            body += data;

            if(body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on("end", function() {
            let data = qs.parse(body);
            data.questionnumber = parseInt(data.questionnumber);

            if(data.type === "choice") {
                deleteChoice(data);
            }

            if(data.type === "question") {
                deleteQuestion(data);
            }

            response.end();
        });
    }

    else {
        response.end();
    }
}
).listen();

// Returns a list of insert queries used for the answer table
createAnswerQueries = (post) => {
    const queryA = "INSERT INTO answer(questionnumber, answerletter, answertext) values (" + 
                    post.questionnumber + ", 'a', '" + post.answera + "')";
        
    const queryB = "INSERT INTO answer(questionnumber, answerletter, answertext) values (" + 
                    post.questionnumber + ", 'b', '" + post.answerb + "')";

    if (post.answerd !== "") {
        const queryC = "INSERT INTO answer(questionnumber, answerletter, answertext) values (" + 
                        post.questionnumber + ", 'c', '" + post.answerc + "')";
        
        const queryD = "INSERT INTO answer(questionnumber, answerletter, answertext) values (" + 
                        post.questionnumber + ", 'd', '" + post.answerd + "')";

        return [queryA, queryB, queryC, queryD];
    }

    else if (post.answerc !== "") {
        const queryC = "INSERT INTO answer(questionnumber, answerletter, answertext) values (" + 
                        post.questionnumber + ", 'c', '" + post.answerc + "')";

        return [queryA, queryB, queryC];
    }

    else {
        return [queryA, queryB];
    }
}

// Returns a list of update queries used for the answer table.
createAnswerQueryUpdates = (put) => {
    const queryA = "UPDATE answer SET answertext = '" +
                    put.answera + "' WHERE questionnumber = " +
                    put.questionnumber + " AND answerletter = 'a';";

    const queryB = "UPDATE answer SET answertext = '" +
                    put.answerb + "' WHERE questionnumber = " +
                    put.questionnumber + " AND answerletter = 'b';";

    const queryC = "UPDATE answer SET answertext = '" +
                    put.answerc + "' WHERE questionnumber = " +
                    put.questionnumber + " AND answerletter = 'c';";

    const queryD = "UPDATE answer SET answertext = '" +
                    put.answerd + "' WHERE questionnumber = " +
                    put.questionnumber + " AND answerletter = 'd';";

    if (put.answerd !== "") {
        return [queryA, queryB, queryC, queryD];
    }

    else if (put.answerc !== "") {
        return [queryA, queryB, queryC];
    }

    else {
        return [queryA, queryB];
    }

}

// Inserts new choices that have been added to questions to the answer table.
insertNewChoices = (post) => {
    const query = "INSERT INTO answer(questionnumber, answerletter, answertext)" +
    " values (" + post.questionnumber + ", '" + post.answerletter + "', '" +
    post.answertext + "');";

    db.query(query, function(err, result) {
        if(err) {
            throw err;
        }
        console.log("Choice added to answer table!");
    });
}

// Inserts newly created questions into both the question and answer tables.
insertEntries = (post) => {
    const questionQuery =   "INSERT INTO question(questionnumber, questiontext, correctanswer) values (" + 
                            post.questionnumber + ", '" + post.questiontext + "', '" + post.correctanswer +
                            "')";

    db.query(questionQuery, function(err, result) {
        if(err) {
            throw err;
        }
        console.log("Entry added to db!");
    });

    const answerQueries = createAnswerQueries(post);

    for(let i = 0; i < answerQueries.length; i++) {
        db.query(answerQueries[i], function(err, result) {
            if(err) {
                throw err;
            }
            console.log("Entry added to db!");
        });
    }
}

/*
Queries the database to update entries in both the question and answer tables.
*/ 
updateEntry = (put) => {
    const questionTableQuery = "UPDATE question SET questiontext = '" +
                            put.questiontext + "', correctanswer = '" +
                            put.correctanswer + "' WHERE questionnumber = " +
                            put.questionnumber + ";";

    db.query(questionTableQuery, function(err, result) {
        if(err) {
            throw err;
        }
    });
    
    const answerTableQueries = createAnswerQueryUpdates(put);

    for(let i = 0; i < answerTableQueries.length; i++) {
        db.query(answerTableQueries[i], function(err, result) {
            if(err) {
                throw err;
            }
        });
    }
}

decrementQuestionNumbers = (put) => {
    const questionTableQuery = "UPDATE question SET questionnumber =" +
    " questionnumber - 1 WHERE questionnumber > " + put.questionnumber + ";"

    db.query(questionTableQuery, function(err, result) {
        if(err) {
            throw err;
        }

        console.log("Question numbers decremented.");
    });
}

// Queries the answer table to delete a row.
deleteChoice = (data) => {
    const query = "DELETE FROM answer WHERE questionnumber = " +
                data.questionnumber + " AND answerletter = '" + 
                data.answerletter + "';";

    db.query(query, function(err, result) {
        if(err) {
            throw err;
        }

        console.log("Answer row deleted.");
    });
}

/*
Queries both the answer and question tables to delete
full questions from the db.
*/
deleteQuestion = (data) => {
    console.log("reached123");
    const questionTableQuery = "DELETE FROM question WHERE questionnumber = " +
                               data.questionnumber + ";";

    const answerTableQuery = "DELETE FROM answer WHERE questionnumber = " +
                            data.questionnumber + ";";

    db.query(questionTableQuery, function(err, result) {
        if(err) {
            throw err;
        }

        console.log("Question deleted.");
    });

    db.query(answerTableQuery, function(err, result) {
        if(err) {
            throw err;
        }
    });
}

deleteEntries = (post) => {
    const query = "DELETE FROM question WHERE questionnumber >" + post.numberofquestions;

    db.query(query, function(err, result) {
        if(err) {
            throw err;
        }
    });
}

retrieveEntries = (response, q) => {
    let query = "";

    if(q.query.req == "question") {
        query = "SELECT * FROM question";
        db.query(query, function(err, result) {
        if(err) {
            throw err
        }
        response.write(JSON.stringify(result));
        response.end();
    });
    }

    else if(q.query.req == "answer"){
        query = "SELECT * FROM answer";
        db.query(query, function(err, result) {
        if(err) {
            throw err
        }
        response.write(JSON.stringify(result));
        response.end();
    });
    }
}
