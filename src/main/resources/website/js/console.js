function clearConsoleLine() {
    var scrollArea = $(".console-terminal");
    scrollArea.empty();
}


function addLine(line) {
    var scrollArea = $(".console-terminal");
    scrollArea.append(line);
    scrollArea.scrollTop(function() { return this.scrollHeight; });
}

function addEmptyConsoleLine() {
    var line = $("<div></div>");
    line.addClass("console-line");
    line.addClass("line-color-white");
    line.html("&nbsp;");
    addLine(line);
}

function addConsoleLine(msg, color) {
    var line = $("<div></div>");
    line.addClass("console-line");
    line.addClass("line-color-white");
    line.html(msg);
    addLine(line);
}

function addConsoleData(msg, color) {
    var line = $("<div></div>");
    line.addClass("console-line");
    line.addClass("line-color-gray");
    line.html(msg);
    addLine(line);
}