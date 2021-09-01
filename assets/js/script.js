//GLOBAL VARIABLES
var startTime = 9;
var endTime = 17;

var tasks = [];

//FUNCTIONS

//generate an empty tasks array
var generateTasks = function() {
    if (startTime > endTime) {
        return false;
    }
    tasks = [];
    for (let i = startTime; i < endTime + 1; i++) {
        var timeObj = {};
        timeObj.time = i;
        timeObj.text = "";
        tasks.push(timeObj);
    }
}

//generate a time block
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
    var textP = $("<p>").addClass("description col-10 text-left py-2 px-2 mb-0").text(text);
    var button = $("<button>").addClass("btn saveBtn col-1").html('<i class="fas fa-save"></i>');
    rowDiv.append(timeSpan,textP,button);
    auditWorkDay(rowDiv);
    containerEl.append(rowDiv);
}

//load the workday
var loadWorkDay = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        generateTasks();
    }
    for (let i = 0; i < tasks.length; i++) {
        generateTime(tasks[i].time,tasks[i].text);
    }
}

//save tasks array to local storage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

//print date at top of screen
var loadDate = function() {
    var currentDayEl = $("header").find("#currentDay");
    var date = moment().format("dddd, MMMM Do");
    currentDayEl.text(date);
}

var auditWorkDay = function (taskEl) {
    //get time (hour) from id
    var time = parseInt($(taskEl).attr("id"));
    //get current hour
    var currentTime = parseInt(moment().format("H"));
    //remove any old classes from element
    var pEl = $(taskEl).find("p");
    //if there is no paragraph, we know we are editing, so set it to the textarea instead
    if (pEl.length === 0) {
        pEl = $(taskEl).find("textarea");
    }
    pEl.removeClass("past present future");
    //apply new class after comparing times
    if (time < currentTime) {
        pEl.addClass("past");
    } else if (time === currentTime) {
        pEl.addClass("present");
    } else if (time > currentTime) {
        pEl.addClass("future");
    }
}

//EVENT LISTENERS
$(".container").on("click", "p", function() {
    //get current text and current parent
    var text = $(this).text().trim();
    var parent = $(this).parent();
    //create a text area and set the text to the current text
    var textInput = $("<textarea>").addClass("col-10 py-2 px-2 mb-0").val(text);
    //replace the p with the text area
    $(this).replaceWith(textInput);
    auditWorkDay(parent);
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
    var taskP = $("<p>").addClass("description col-10 text-left py-2 px-2 mb-0").text(text);
    //replace textarea with p element
    textArea.replaceWith(taskP);
    auditWorkDay($(this).parent());
});

loadWorkDay();
loadDate();

setInterval(function() {
    $(".container .time-block").each(function(index, el) {
            auditWorkDay(el);
        });
    }, 1000 * 5);

setInterval(loadDate, 1000 * 60);