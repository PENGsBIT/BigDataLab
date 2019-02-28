var storage = require('node-persist');
module.exports = {
    init: function () {
        storage.initSync();
    },
    setTable: function (jid, tab) {
        //map[jid]= {"tables":tab};
        var info = storage.getItemSync(jid);
        if (!info) {
            info = {};
        } else {
            console.log("setTable: table already exist, will override it. Old Tables: " + JSON.stringify(info));
        }
        info["tables"] = tab;
        storage.setItemSync(jid, info);
        // console.log(JSON.stringify());
        console.log("setTable: tables set, new table: " + JSON.stringify(storage.getItemSync(jid)));
    },

    getTable: function (jid) {
        var info = storage.getItemSync(jid);
        if (!info) {
            return [];
        }
        console.log("getTable: " + JSON.stringify(info));
        //return map[jid].tables;
        return info.tables;
    },

    settaskId: function (jid, taskId) {
        var info = storage.getItemSync(jid);
        console.log("jid: " + jid + "info: " + JSON.stringify(info));
        if (!info) {
            console.error("tables must be specified before set flow id.");
            return;
        }
        var tables = info.tables;
        if (!tables) {
            console.error("No table specified!");
            return;
        }

        info["taskId"] = taskId;
        storage.setItemSync(jid, info);
        console.log("settaskId called." + JSON.stringify(storage.getItemSync(jid)));
    },

    gettaskId: function (jid) {
        var info = storage.getItemSync(jid);
        if (!info || !info.taskId) {
            console.error("no flow id correspond to jid:" + jid);
            return;
        }
        console.log("gettaskId called.\n" + JSON.stringify(info));
        return info.taskId;
    },

    deleteId: function (jid) {
        //delete map[jid];
        storage.removeItemSync(jid);
        console.log("delete called.\n");
    }
}