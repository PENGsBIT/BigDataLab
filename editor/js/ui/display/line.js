RED.line = (function() {
    var option = {
        title: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            }
        },
        legend: {
            data: []
        },
        dataZoom: [{
            type: 'slider',
            start: 50,
            end: 100
        }],
        xAxis: {
            type: 'time'
        },
        yAxis: {
            type: 'value',
            min: 100,
            max: 800,
            boundaryGap: [0, '100%']
        }
    };

    var _option = {};

    function init(data) {
        _option = RED.comms.deepCopy(option);
        _option.title.text = '';
        var legend = [];
        var series = {};
        $.each(data[0], function(name, value) {
            if (name !== 'date') {
                legend.push(name);
                series[name] = {};
                series[name].name = name;
                series[name].type = 'line';
                series[name].smooth = true;
                series[name].data = [];
            }
        });
        $.each(data, function(i, value) {
            var date = value.date;
            for (var j = 0; j < legend.length; j++) {
                var unit = {};
                unit.name = date;
                unit.value = [date, Math.round(value[legend[j]])];
                series[legend[j]].data.push(unit);
            }
        });
        _option.legend.data = legend;
        _option.series = [];
        $.each(series, function(name, value) {
            _option.series.push(value);
        });
        console.log(_option);
        return _option;
    }

    function display() {
        return option;
    }

    function refresh(data) {
        var legend = _option.legend.data;
        var series = RED.comms.deepCopy(_option.series);
        $.each(data, function(i, value) {
            var date = value.date;
            for (var j = 0; j < legend.length; j++) {
                var unit = {};
                unit.name = date;
                unit.value = [date, Math.round(value[legend[j]])];
                for (var k = 0; k < series.length; k++) {
                    if (series[k].name === legend[j]) {
                        series[k].data.push(unit);
                        break;
                    }
                }
            }
        });
        var _series = [];
        for (var k = 0; k < _option.series.length; k++) {
            $.each(series, function(name, value) {
                if (value.name === _option.series[k].name) {
                    _series.push({data: value.data});
                }
            });
            _option.series[k].data = _series[k].data;
        }
        return {series: _series};
    }

    return {
        init: init,
        display: display,
        refresh: refresh
    }
})();
