RED.log_ws_fe = (function() {
    var socket;

    function getUrlParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        const r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return unescape(r[2]); return null; //返回参数值
    }

    function init() {
        var path = location.hostname + ':1883/ws/log';
        socket = new WebSocket('ws://' + path);
        socket.onerror = function (event) {
            onError(event);
        };
        socket.onopen = function (event) {
            onOpen(event);
        };
        socket.onmessage = function (event) {
            onMessage(event);
        }
    }

    function onError(event) {
    }

    function onOpen(event) {
        var sessionConfig = {
            type: 'jid',
            jid: getUrlParam('jid')
        };
        socket.send(JSON.stringify(sessionConfig));
    }

    function onMessage(event) {
        event.data.split('\n').forEach(function (log) {
            RED.log_display_fe.append(log);
        });
    }

    return {
        init: init
    }
})();
