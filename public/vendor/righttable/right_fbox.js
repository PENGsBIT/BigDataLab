/*
edit by zpc
 */

    $(document).ready(function () {
    $(".side ul li").hover(function () {
        $(this).find(".sidebox").stop().animate({"width": "124px"}, 200).css({
            "opacity": "1",
            "filter": "Alpha(opacity=100)",
            "background": "#ae1c1c"
        })
    }, function () {
        $(this).find(".sidebox").stop().animate({"width": "54px"}, 200).css({
            "opacity": "0.8",
            "filter": "Alpha(opacity=80)",
            "background": "#000"
        })
    });
        $("#side1").click(function(){
            alert("任务已经成功提交");
            var taskid=this.taskId;
            $post("http://10.141.212.118:8083/statusquery",taskid,function(responseTxt,statusTxt,xhr){
                if(statusTxt=="SUCCESS")
                    alert("任务已经成功提交");
                if(statusTxt=="CALCULATING")
                    alert("任务正在计算");
                if(statusTxt=="PROCESSING")
                    alert("数据正在处理");
                if(statusTxt=="FAILED")
                    alert("Error: "+xhr.status+": "+xhr.statusText);
            });
        });
        $("#side2").click(function(){

            $post("http://10.141.212.118:8083/taskinfo",function (data) {
                var taskprocess=data;
            });
        });

        $("#side3").click(function(){
            var jid=getUrlParam('jid');
            // resulturl="/?jid="+jid+"&view=result"

            // var  taskid=location.href.split('flow/')[1];
            // taskid=1;
            //  var taskid = storage.getItemSync(jid);
            // resulturl="http://10.141.212.118:3030/dv/index.html"+"&task_id="+taskid
            var resulturl= "/result/"+jid;
            window.open(resulturl);
        });
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }
});

// //回到顶部
    // function goTop() {
    //     $('html,body').animate({'scrollTop': 0}, 600);
    // }
