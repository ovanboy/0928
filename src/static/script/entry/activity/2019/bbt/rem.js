(function () {
    var w = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);

    document.documentElement.style.fontSize = w / 7.5 + 'px';

    window.addEventListener('resize', function () {
        w = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
        document.documentElement.style.fontSize = w / 7.5 + 'px';
    })

})();