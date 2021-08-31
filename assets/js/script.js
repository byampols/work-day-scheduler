
$(".time-block").on("click", "p", function() {
    var text = $(this).text().trim();
    var textInput = $("<textarea>").addClass("col-10 past py-2 px-2 mb-0").val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

$(".time-block").on("click", ".saveBtn", function() {
    //get textarea
    var textArea = $(this).parent().find("textarea");
    //if there is no textarea, exit this function
    if (textArea.length === 0) {
        return false;
    }
    //get current text value
    var text = textArea.val().trim();
    //recreate p element
    var taskP = $("<p>").addClass("description col-10 text-left past py-2 px-2 mb-0").text(text);
    //replace textarea with p element
    textArea.replaceWith(taskP);
});
