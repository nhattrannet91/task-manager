const mongoDb = require("mongodb");
const MongoClient = mongoDb.MongoClient;

const databaseUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(databaseUrl, { useNewUrlParser: true}, (error, client) => {
    if(error){
       return console.log("Unable to connect to DB");
    }

    client.db(databaseName).collection("tasks").insertMany([
        {
            description: "Training NodeJS",
            isCompleted: false
        },
        {
            description: "Finding out the way to test concurrency",
            isCompleted: false
        },
        {
            description: "Doing exercise",
            isCompleted: true
        },
    ], (error, result) => {
        if(error) {
            return console.log("Error when inserting tasks")
        }

        console.log(result.ops);
    })
})
