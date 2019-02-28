RED.result_ws_fe = (function() {
    var socket;
    var currentType;
    var chart;
    var table;

    function getUrlParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        const r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return unescape(r[2]); return null; //返回参数值
    }

    function init() {
        var path = location.hostname + ':1884/ws/result';
        socket = new WebSocket('ws://' + path);
        socket.onerror = function (event) {
            onError(event);
        };
        socket.onopen = function (event) {
            onOpen(event);
        };
        socket.onmessage = function (event) {
            onMessage(event);
        };
        currentType = 'null';
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
        var response = JSON.parse(event.data);
        if (response.type !== null) {
            switch (response.type) {
                case 'table':
                    if (currentType !== 'table') {
                        $('#result-container').html(RED.table.init(response.data));
                        table = $('#result-table').DataTable();
                    } else {
                        RED.table.refresh(table, response.data);
                    }
                    $('#pie-1').html('');
                    var pie1 = echarts.init(document.getElementById('pie-1'));
                    pie1.setOption(RED.pie.display(response.data, 'connectiontype', 'pie-1'));
                    $('#pie-2').html('');
                    var pie2 = echarts.init(document.getElementById('pie-2'));
                    pie2.setOption(RED.pie.display(response.data, 'telecomsoperator', 'pie-2'));
                    $('#pie-3').html('');
                    var pie3 = echarts.init(document.getElementById('pie-3'));
                    pie3.setOption(RED.pie.display(response.data, 'appplatform', 'pie-3'));
                    window.onresize = function () {
                        pie1.resize();
                        pie2.resize();
                        pie3.resize();
                    };
                    pie1.resize();
                    pie2.resize();
                    pie3.resize();
                    break;
                // case 'alert':
                //     RED.notify(RED._("Error! Table doesn't exist!"),"error");
                //     break;
                case 'kmeans':
                    $('#result-container').html('');
                    var scatterChart = echarts.init(document.getElementById('result-container'));
                    scatterChart.setOption(RED.kmeans.display());
                    window.onresize = scatterChart.resize;
                    break;
                case 'bar':
                    $('#result-container').html('');
                    var barChart = echarts.init(document.getElementById('result-container'));
                    barChart.setOption(RED.bar.display());
                    window.onresize = barChart.resize;
                    break;
                case 'line':
                    if (currentType !== 'line') {
                        $('#result-container').html('');
                        chart = echarts.init(document.getElementById('result-container'));
                        chart.setOption(RED.line.init(response.data));
                        window.onresize = chart.resize;
                    } else {
                        chart.setOption(RED.line.refresh(response.data));
                    }
                    break;
            }
            currentType = response.type;
            currentType = 'null';
        }

    }

    return {
        init: init
    }
})();
