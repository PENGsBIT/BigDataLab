function signup() {
    // var username=document.getElementById('usrname').value;
    // var password=document.getElementById('password').value;
    var user = {
        username:$("#usrname").val(),
        password:$("#password").val()
    };
    $.ajax({
        url: "http://10.141.212.118:1880/user",
        // url: ":1880/verify",
        data: user,
        dataType: "json",
        type: "post",
        error: function(xhr,errmsg,err){
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about error to the console
        },
        success: function (data) {
            result=data.result;
            if (result == "fail") {
                alert("注册失败！")
            } else if (result == "ok"){
                alert("注册成功！");
            }
            else alert(error);
        }
    });
}