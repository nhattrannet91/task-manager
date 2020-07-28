require("../db/mongoose/mongoose");
const Task = require("../db/models/task");
const { count } = require("../db/models/task");
 // Task.findByIdAndRemove("5f1c39a798d5302f3836df04").then(result => Task.count({completed: false}))
     // .then(count => console.log(count))
     // .catch(error => console.log("Error: " + error))

const removeTaskAndCountInCompletedTasks = async (id) => {
    const removedTask = await Task.findByIdAndRemove(id);
    console.log("Removed Task: " + removedTask);

    const count = await Task.count({completed : false});
    return count;
}

removeTaskAndCountInCompletedTasks("5f1d259ea3b7801ce42b4302").then(count => console.log("Count: " + count))
.catch(error => console.log("Error: " + error));