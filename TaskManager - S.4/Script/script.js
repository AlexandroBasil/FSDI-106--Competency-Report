let detailsVisible = true;
let important = false;
let tasks = [];
var serverUrl = "https://fsdiapi.azurewebsites.net/";


function categoryInput() {
    let categoryInput = $("#selCategory").val();

    if ( categoryInput === "5" ) {
        $("#txtCategory").removeClass('hide');
        // $("#selCategory").addClass('hide');
    } else {
        $("#txtCategory").addClass('hide');
    }

    console.log( categoryInput )
}

function toggleStar() {
    if (important) {
        $("#iStar").removeClass('fas').addClass('far');
        important = false;
    } else {
        $("#iStar").removeClass('far').addClass('fas');
        important = true;
    }
}

function toggleDetails() {
    if ( detailsVisible ) {
        $("#capture-form").hide();
        detailsVisible = false;
    } else {
        $("#capture-form").show();
        detailsVisible = true;
    }
}

function saveTasks() {
    console.log("saving task");

    let title = $("#txtTitle").val();
    let description = $("#txtDescription").val();
    let location = $("#txtLocation").val();
    let dueDate = $("#selDueDate").val();
    let category = $("#selCategory").val();
    if (category === "5") category = $("#txtCategory").val();
    let color = $("#selColor").val();
    
    let task = new Task(title, important, description, location, dueDate, category, color);
    console.log(task)


    $.ajax({
        type: "POST",
        url: serverUrl + "api/tasks/",
        data: JSON.stringify(task),
        contentType: "application/json",

        success: function(res) {
            console.log("Server says: ", res);
            let responseTask = JSON.parse(res);
            displayTask(responseTask);
        },
        error: function(err) {
            console.log("Error saving: ", err);
        }
    });
}

function fetchTasks() {
    //create a get request to
    // url
    $.ajax({
        type: "GET",
        url: serverUrl + "api/tasks",
        
        success: function(response) {
            tasks = JSON.parse(response);
            for (var i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                if (task.name === "AGarcia94") {
                    displayTask(task);
                }
            }

            console.log("Server says: ", tasks);
        },
        error: function(err) {
            console.log("Error getting data", err);
        }
    });
}

function displayTask(task) {
    // create syntax
    let syntax = `
    <div id="${task._id}" class="task">
        <i class="important fas fa-star"></i>
        <div class="description">
            <h5>${task.title}</h5>
            <p>${task.description}</p>
        </div>
        <label class="location">${task.location}</label>
        <label class="due-date">${task.dueDate}</label>
        <button class="btn btn-sm btn-primary" onclick="markDone('${task._id}')"><i class="fas fa-check"></i></button>
    </div>`;

    // append syntax to container
    if (task.status === "Done") {
        $("#doneTasks").append(syntax);
    } else {
        $("#pendingTasks").append(syntax);
    }
}

function markDone(id) {
    console.log("Clicked on done btn!", id);
    $("#" + id).remove();

    for (let i = 0; i < tasks.length; i++) {
        let item = tasks[i];
        if (item._id === id) {
            item.status = "Done";

            $.ajax({
                type: "PUT",
                url: serverUrl + "api/tasks",
                data: JSON.stringify(item),
                contentType: "application/json",
                success: function(res){
                    console.log("Put results", res);
                    let updatedTasks =JSON.parse(res);
                    displayTask(updatedTasks);
                },
                error: function(err) {
                    console.log("Error updating", err);
                }
            });
        }
    }

}


function init() {
    console.log("Welcome to the Ultimate Task Manager")
    // load prev data
    fetchTasks();

    //hook events
    $("#selCategory").change( categoryInput );
    $("#btnDisplay").click( toggleDetails );
    $("#iStar").click( toggleStar );
    $("#btnSave").click( saveTasks );
}

window.onload = init;



function testRequest() {
    $.ajax({
        type: "GET",
        url: "https://restclass.azurewebsites.net/api/test",
        success: function(response) {
            console.log("Response from server", response)
        },
        error: function(errorDetails) {
            console.log("Error calling server", errorDetails)
        }
    })
}