$(function () {
    $("input:checked").each(function (i, dom) {
        $(this).change(function () {
            if (this.checked == false) {
                $(this).parent().siblings().show(function () {
                })
            }
            else {
                $(this).parent().siblings().hide(function () {
                    //存储
                    var val = $(this).val()
                    var index = $(this).prop("name")
                    localStorage.setItem('name' + index, val)


                })

            }

        })
    })

})
