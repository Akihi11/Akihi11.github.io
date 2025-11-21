function switchNightMode() {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>'),
        setTimeout(function () {
            const modeicon = document.getElementById('modeicon');
            document.querySelector('body').classList.contains('DarkMode') ? (document.querySelector('body').classList.remove('DarkMode'), localStorage.setItem('isDark', '0'), modeicon && modeicon.setAttribute('xlink:href', '#icon-moon')) : (document.querySelector('body').classList.add('DarkMode'), localStorage.setItem('isDark', '1'), modeicon && modeicon.setAttribute('xlink:href', '#icon-sun')),
                setTimeout(function () {
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.transition = 'opacity 3s';
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.opacity = '0';
                    setTimeout(function () {
                        document.getElementsByClassName('Cuteen_DarkSky')[0].remove();
                    }, 1e3);
                }, 2e3)
        })
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        // 先设置太阳月亮透明度
        const sun = document.getElementById("sun");
        const moon = document.getElementById("moon");
        if (sun) sun.style.opacity = "1";
        if (moon) moon.style.opacity = "0";
        setTimeout(function () {
            if (sun) sun.style.opacity = "0";
            if (moon) moon.style.opacity = "1";
        }, 1000);

        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        // GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        const modeicon = document.getElementById('modeicon');
        if (modeicon) modeicon.setAttribute('xlink:href', '#icon-sun')
        // 延时弹窗提醒
        // setTimeout(() => {
        //     new Vue({
        //         data: function () {
        //             this.$notify({
        //                 title: "🌙",
        //                 message: "当前已成功切换至夜间模式！",
        //                 position: 'top-left',
        //                 offset: 50,
        //                 showClose: true,
        //                 type: "success",
        //                 duration: 5000
        //             });
        //         }
        //     })
        // }, 2000)
    } else {
        // 先设置太阳月亮透明度
        const sun = document.getElementById("sun");
        const moon = document.getElementById("moon");
        if (sun) sun.style.opacity = "0";
        if (moon) moon.style.opacity = "1";
        setTimeout(function () {
            if (sun) sun.style.opacity = "1";
            if (moon) moon.style.opacity = "0";
        }, 1000);
        
        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        document.querySelector('body').classList.add('DarkMode');
        const modeicon = document.getElementById('modeicon');
        if (modeicon) modeicon.setAttribute('xlink:href', '#icon-moon')
        // setTimeout(() => {
        //     new Vue({
        //         data: function () {
        //             this.$notify({
        //                 title: "🌞",
        //                 message: "当前已成功切换至白天模式！",
        //                 position: 'top-left',
        //                 offset: 50,
        //                 showClose: true,
        //                 type: "success",
        //                 duration: 5000
        //             });
        //         }
        //     })
        // }, 2000)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
}