// 设置移动端字体大小
(function() {
    var html = document.documentElement;
    var hWidth = html.getBoundingClientRect().width;
    if (hWidth >= 500) {
        hWidth = 500;
    }
    html.style.fontSize = hWidth / 15 + "px";
})()
