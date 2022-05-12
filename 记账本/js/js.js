$(function () {
    $.get("  https://api.xlongwei.com/service/datetime/workday.json", function (data) {
        $(".ttime").text("当前日期: " + data.day)
    })
    $(".1").click(function () {
        $("body").addClass("heian")
        $(".main").css("background", "gray")
        $("#add").css("background", "black")
    })
    $(".2").click(function () {
        $("body").removeClass("heian")
        $(".main").css("background", "rgb(226 221 212 )")
        $("#add").css("background", "darkcyan")

    })
    var shouru = 0;//收入
    var zhichu = 0;//支出
    var num = 0;
    //点击#add
    $("#add").click(function () {
        //判断input内容是否符合要求
        var reg = /^[\+\-](\d+|\d+\.\d{1,2})$/;
        if ($("#name").val() === "" || $("#money").val() === "" || !reg.test($("#money").val())) {
            //不符合要求，需要提醒用户
            alert("请输入正确的内容!");
            return;
        }
        //创建li，填充内容，并添加到指定的ul中
        var type = $("#money").val().slice(0, 1);
        var color = type === "+" ? 'green' : 'tomato';
        var str = `
        <div>
                <li style="border-right: 4px solid ${color};">
                <input type="checkbox" checked ='checked' style="width:20px; height:20px; float: left;" id="number${num}">
                <span class="name">${$("#name").val()}</span>
                <span class="time">${$.get("https://api.xlongwei.com/service/datetime/workday.json", function (data) {
            $(".time").text("添加日期: " + data.day)
        })
            }</span >
                <span class="money" style="color:${color};">${$("#money").val()}</span>
                <button class="glyphicon glyphicon-remove-sign del"></button>
        </li >
        <input type="text" style="display:none;">
        </div> `
        num++;

        var h = $(".main").height();
        var zi = $("li").height();
        h = h + 3 * zi
        $(".main").animate({
            height: h + 2 * zi
        });
        $(str).appendTo($("ul")).find(".del").click(function () {
            var obj = JSON.parse(localStorage.record);
            //因为是删掉操作，所以是反操作
            if ($(this).prev().html().includes("+")) {
                //收入
                var m = $(this).prev().html().slice(1) / 1;
                shouru -= m;
                $("#shouru").html(shouru);
            } else {
                var m = $(this).prev().html().slice(1) / 1;
                zhichu -= m;
                $("#zhichu").html(zhichu);
            }
            $("#yue").html(shouru - zhichu);
            obj.zhichu = zhichu;
            obj.shouru = shouru;
            //删除对应数据
            var index = $("li").index($(this).parent());
            obj.list.splice(index, 1);
            localStorage.record = JSON.stringify(obj);
            $(this).parent().remove();
            var h = $(".main").height();
            var zi = $("li").height();
            h = h + zi
            $(".main").animate({
                height: h + zi
            });
        });
        //收入，支出，余额发生对应的变化
        changMoney($("#money").val());
        var obj = JSON.parse(localStorage.record);
        obj.list.push({
            type: type,
            name: $("#name").val(),
            money: $("#money").val() //.slice(1)
        })
        obj.zhichu = zhichu;
        obj.shouru = shouru;
        localStorage.record = JSON.stringify(obj);
        //清空input
        $("input").val("");
        location.reload();
    })
    //m="+100"||"-100";
    function changMoney(m) {
        var type = m.slice(0, 1);
        var money = m.slice(1);
        if (type === "+") {
            shouru += money / 1;
            $("#shouru").html(shouru);
        } else {
            zhichu += money / 1;
            $("#zhichu").html(zhichu);
        }
        $("#yue").html(shouru - zhichu);
    }
    //储存机制
    //判断localstorage是否包含该数据
    if (!localStorage.record) {
        //不存在
        var data = {
            zhichu: 0,
            shouru: 0,
            list: []
        }
        localStorage.record = JSON.stringify(data);
    }
    var obj = JSON.parse(localStorage.record);
    zhichu = obj.zhichu / 1;
    shouru = obj.shouru / 1;
    //修改指出和收入及余额的值
    $("#zhichu").html(zhichu);
    $("#shouru").html(shouru);
    $("#yue").html(shouru - zhichu);
    //根据数组的内容添加li

    obj.list.forEach(function (item, index) {

        console.log(localStorage.getItem('name' + index));
        console.log(item.money);
        console.log(item.name);
        var name = item.name;
        var nameupdate = localStorage.getItem('name' + index);
        if (nameupdate) {
            name = nameupdate
        }
        var color = item.type === "+" ? 'green' : 'tomato';
        var str = `
        <div>
                <li style = "border-right: 4px solid ${color};">
                <input type="checkbox" checked ='checked'style="width:20px; height:20px; float: left;" id="number${num}">
                <span class="name">${name}</span> 
        
                <span style="display:none;">${index}</span> 
                <span class="time">${$.get("https://api.xlongwei.com/service/datetime/workday.json", function (data) {
            $(".time").text("添加日期: " + data.day)
        })
            }</span>
                <span class="money" style="color: ${color}">${item.money}</span>
                <button class="glyphicon glyphicon-remove-sign del"></button>
            </li >
            <input type="text" placeholder="请修改" name="${index}" style="display:none;">
</div>
        `;
        num++;
        $(str).appendTo($("ul"))
            .find(".del").click(function () {
                //因为是删掉条目，所以money需要反操作
                if ($(this).prev().html().includes("+")) {
                    //收入
                    var m = $(this).prev().html().slice(1) / 1;
                    shouru -= m;
                    $("#shouru").html(shouru);
                } else {
                    //支出
                    var m = $(this).prev().html().slice(1) / 1;
                    zhichu -= m;
                    $("#zhichu").html(zhichu);
                }
                $("#yue").html(shouru - zhichu);
                var obj = JSON.parse(localStorage.record)
                obj.zhichu = zhichu;
                obj.shouru = shouru;
                //删除对应数据
                var index = $("li").index($(this).parent());
                console.log(index);
                obj.list.splice(index, 1);
                localStorage.record = JSON.stringify(obj);
                $(this).parent().remove();
            });
    })
    $('#ss').click(function () {
        var sstxt = $('#querytxt').val();
        $("ul li")
            .hide()
            .filter(":contains('" + sstxt + "')")
            .show();
    })
})
