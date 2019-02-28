RED.startup = (function () {
    function getUrlParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        const r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return unescape(r[2]); return null; //返回参数值
    }

    return {
        init: function () {
            $.ajax({
                url:"startup",
                type: "POST",
                data: JSON.stringify({jid: getUrlParam("jid")}),
                contentType: "application/json; charset=utf-8",
                headers: {
                    "Node-RED-Deployment-Type":'full'
                }
            });
            var view = getUrlParam('view');
            if (view === 'result') {
                $('#palette').css('display', 'none');
                $('#sidebar').css('display', 'none');
                $('#sidebar-separator').css('display', 'none');
                $('.red-ui-tabs.red-ui-tabs-add.red-ui-tabs-scrollable').css('display', 'none');
                $('#workspace').css('left', '0px');
                $('#workspace').css('right', '0px');
                $('')
            } else {
                $('#result-panel').css('display', 'none');
                $('#chart').css('margin-bottom', '0px');
                $('#log-container').css('display', 'none');
                $('#sidebar-content').css('margin-bottom', '0px');
                $('#chart-cover').css('display', 'none');
            }
        }
    }
})();