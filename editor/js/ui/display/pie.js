RED.pie = (function() {
    function display(data, indices, title) {
        var legend = [];
        const values = [];
        $.each(data, function (i, record) {
            const obj = JSON.parse(record);
            if (obj[indices] !== undefined && obj[indices] !== 0 && obj[indices] > 0) {
                const k = contains(legend, obj[indices]);
                if (k < 0) {
                    legend.push(obj[indices]);
                    values.push(1);
                } else {
                    values[k] = values[k] + 1;
                }
            }
        });
        const series = [];
        $.each(legend, function (i, record) {
           series.push({name: legend[i], value: values[i]});
        });
        series.sort(function (a, b) {
           return a.name - b.name;
        });
        legend = [];
        $.each(series, function (i, value) {
           legend.push(value.name);
        });
        console.log({
            title : {
                text: title,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legend
            },
            series : [
                {
                    name: title,
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: series,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
        return {
            title : {
                text: title,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legend
            },
            series : [
                {
                    name: title,
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: series,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    function contains(array, element) {
        for (var i = 0; i < array.length; i++)
            if (array[i] === element) {
                return i;
            }
        return -1;
    }

    return {
        display: display
    }
})();
