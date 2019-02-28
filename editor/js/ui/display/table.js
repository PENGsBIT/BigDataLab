RED.table = (function() {
    var properties;

    function resolveHead(data) {
        properties = [];
        var tuples = JSON.parse(data[0]);
        $.each(tuples, function(name, value) {
            properties.push(name);
        });
        var head = '<tr>';
        $.each(properties, function(i, value) {
            head += ('<th>' + value + '</th>');
        });
        head += '</tr>';
        return head;
    }


    function resolveFoot(data) {
        return resolveHead(data);
    }


    function resolveBody(data) {
        var body = '';
        $.each(data, function(i, obj) {
            var unit = '<tr>';
            var record = JSON.parse(obj);
            $.each(properties, function(j, property) {
                $.each(record, function(name, value) {
                    if (name === property) {
                        if (property === 'probability') {
                            unit += ('<td>' + value.values[1] + '</td>');
                        } else {
                            unit += ('<td>' + value + '</td>');
                        }
                    }
                });
            });
            unit += '</tr>';
            body += unit;
        });
        return body;
    }


    function init(data) {
        return '<table id="result-table">' +
            '<thead>' + resolveHead(data) + '</thead>' +
            '<tfoot>' + resolveFoot(data) + '</tfoot>' +
            '<tbody>' + resolveBody(data) + '</tbody>' +
            '</table>'
    }


    function refresh(table, data) {
        var unit;
        $.each(data, function(i, obj) {
            unit = [];
            var record = JSON.parse(obj);
            $.each(properties, function(j, property) {
                $.each(record, function(name, value) {
                    if (name === property) {
                        if (property === 'probability') {
                            unit += ('<td>' + value.values[1] + '</td>');
                        } else {
                            unit += ('<td>' + value + '</td>');
                        }
                    }
                });
            });
            table.row.add(unit).draw(false);
        });
    }

    return {
        init: init,
        refresh: refresh
    }
})();
