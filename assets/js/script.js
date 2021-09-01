//moment().format("H") = current hour in 24 hour clock

//GLOBAL VARIABLES
var startTime = 9;
var endTime = 17;

var tasks = [];

//FUNCTIONS
var generateTasks = function() {
    if (startTime > endTime) {
        return false;
    }
    tasks = [];
    for (let i = startTime; i < endTime + 1; i++) {
        console.log("carrot");
        var timeObj = {};
        timeObj.time = i;
        timeObj.text = "";
        tasks.push(timeObj);
    }
}

var generateTime = function(time, text) {
    var containerEl = $(".container");
    var rowDiv = $("<div>").attr("id", time).addClass("row time-block");
    var timeStamp = "";
    if (time === 0) {
        timeStamp = `${time + 12}AM`;
    } else if (time < 12) {
        timeStamp = `${time}AM`;
    } else if (time === 12) {
        timeStamp = `${time}PM`;
    } else {
        timeStamp = `${time - 12}PM`;
    }
    var timeSpan = $("<span>").addClass("hour col-1 text-right py-3 px-1").text(timeStamp);
    var textP = $("<p>").addClass("description col-10 text-left past py-2 px-2 mb-0").text(text);
    var button = $("<button>").addClass("btn saveBtn col-1").html('<i class="fas fa-save"></i>');
    rowDiv.append(timeSpan,textP,button);
    containerEl.append(rowDiv);
}

var loadWorkDay = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        generateTasks();
    }
    for (let i = 0; i < tasks.length; i++) {
        generateTime(tasks[i].time,tasks[i].text);
    }
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//EVENT LISTENERS
$(".container").on("click", "p", function() {
    var text = $(this).text().trim();
    var textInput = $("<textarea>").addClass("col-10 past py-2 px-2 mb-0").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

$(".container").on("click", ".saveBtn", function() {
    //get textarea
    var textArea = $(this).parent().find("textarea");
    //if there is no textarea, exit this function
    if (textArea.length === 0) {
        return false;
    }
    //get current text value
    var text = textArea.val().trim();
    //find and replace in tasks list
    var editTime = parseInt($(this).parent().attr("id"));
    var index = editTime - startTime;
    tasks[index].text = text;
    saveTasks();
    //recreate p element
    var taskP = $("<p>").addClass("description col-10 text-left past py-2 px-2 mb-0").text(text);
    //replace textarea with p element
    textArea.replaceWith(taskP);
});

loadWorkDay();