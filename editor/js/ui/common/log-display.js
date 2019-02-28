RED.log_display_fe = (function() {
    var logPanel;
    var logSession;

    function init() {
        logPanel = ace.edit("log-content");
        logSession = logPanel.getSession();
        logPanel.setTheme("ace/theme/monokai");
        logPanel.setFontSize(14);
        logSession.setMode("ace/mode/io");
        $('.ace_text-input').attr('readonly', 'readonly');
        // append('Waiting for Deployment\n');
    }

    function append(text) {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        var second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
        var time = hour + ':' + minute + ':' + second;
        logSession.insert({
            row: logSession.getLength(),
            column: 0
        }, text + '\n');
    }

    return {
        init: init,
        append: append
    }
})();
