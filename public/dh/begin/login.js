function login() {

    var user = {
        username:$("#usrname").val(),
        password:$("#password").val()
    };
    var name=$("#usrname").val();
    var pass=$("#password").val();
    $.ajax({
        url: "/verify",
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
                alert("登陆失败！")
            } else {
                alert("登陆成功！");

                $.cookie(name, pass)
                window.location.href = "list.html";
            }
        }
    });
}
