// 获取主题背景
var body = document.getElementById('body');
// 获取音频播放器对象
var audio = document.getElementById('audioTag');

// 歌曲名
var musicTitle = document.getElementById('music-title');
// 歌曲海报
var recordImg = document.getElementById('record-img');
// 歌曲作者
var author = document.getElementById('author-name');

// 进度条
var progress = document.getElementById('progress');
// 总进度条
var progressTotal = document.getElementById('progress-total');

// 已进行时长
var playedTime = document.getElementById('playedTime');
// 总时长
var audioTime = document.getElementById('audioTime');

// 播放模式按钮
var mode = document.getElementById('playMode');
// 上一首
var skipForward = document.getElementById('skipForward');
// 暂停按钮
var pause = document.getElementById('playPause');
// 下一首
var skipBackward = document.getElementById('skipBackward');
// 音量调节
var volume = document.getElementById('volume');
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger');

// 列表
var list = document.getElementById('list');
// 倍速
var speed = document.getElementById('speed');
// MV
var MV = document.getElementById('MV');

// 左侧关闭面板
var closeList = document.getElementById('close-list');
// 音乐列表面板
var musicList = document.getElementById('music-list');

// 暂停/播放功能实现
pause.onclick = function (e) {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
}

// 更新进度条
audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条
function updateProgress() {
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

//音频播放时间换算
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

// 点击进度条跳到指定点播放
progressTotal.addEventListener('mousedown', function (event) {
    // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
    if (!audio.paused || audio.currentTime != 0) {
        var pgsWidth = parseFloat(window.getComputedStyle(progressTotal, null).width.replace('px', ''));
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress(audio);
    }
});

// 点击列表展开音乐列表
list.addEventListener('click', function (event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList.addEventListener('click', closeListBoard);
});

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}

// 存储当前播放的音乐序号
var musicId = 0;

// 后台音乐列表
let musicData = [
    ['洛春赋', '云汐'], 
    ['Yesterday', 'Alok/Sofi Tukker'], 
    ['江南烟雨色', '杨树人'], 
    ['Vision pt.II', 'Vicetone'],
    ['沉默是金', '张国荣'],
    ['刘德华-我恨我痴心', '刘德华-我恨我痴心'],
    ['卢冠廷-一生所爱', '卢冠廷-一生所爱'],
    ['麦浚龙-耿耿于怀', '麦浚龙-耿耿于怀'],
    ['梅艳芳-朦胧夜雨里', '梅艳芳-朦胧夜雨里'],
    ['梅艳芳-似是故人来', '梅艳芳-似是故人来'],
    ['欧阳耀莹-春娇与志明', '欧阳耀莹-春娇与志明'],
    ['区瑞强-陌上归人', '区瑞强-陌上归人'],
    ['孙耀威-爱的故事(上集)', '孙耀威-爱的故事(上集)'],
    ['谭咏麟-爱在深秋', '谭咏麟-爱在深秋'],
    ['谭咏麟-讲不出再见', '谭咏麟-讲不出再见'],
    ['谭咏麟-一生中最爱', '谭咏麟-一生中最爱'],
    ['王菲-容易受伤的女人', '王菲-容易受伤的女人'],
    ['王菲-约定', '王菲-约定'],
    ['王杰-谁明浪子心', '王杰-谁明浪子心'],
    ['王力宏-好心分手', '王力宏-好心分手'],
    ['巫启贤-太傻', '巫启贤-太傻'],
    ['吴若希-越难越爱', '吴若希-越难越爱'],
    ['吴雨霏-我本人', '吴雨霏-我本人'],
    ['吴雨霏-吴哥窟', '吴雨霏-吴哥窟'],
    ['许冠杰-半斤八两', '许冠杰-半斤八两'],
    ['许冠杰-浪子心声', '许冠杰-浪子心声'],
    ['于梓贝-夏天的风', '于梓贝-夏天的风'],
    ['张学友-相思风雨中', '张学友-相思风雨中'],
    ['周柏豪-够钟', '周柏豪-够钟'],
    ['周慧敏-最爱', '周慧敏-最爱']
];

// 初始化音乐
function initMusic() {
    audio.src = "mp3/music" + musicId.toString() + ".mp3";
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.ondurationchange = function () {
        musicTitle.innerText = musicData[musicId][0];
        author.innerText = musicData[musicId][1];
        recordImg.style.backgroundImage = "url('img/record1"+".jpg')";
        body.style.backgroundImage = "url('img/bg0"+".png')";
        audioTime.innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
        refreshRotate();
    }
}
initMusic();

// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}

// 播放模式设置
var modeId = 1;
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    mode.style.backgroundImage = "url('img/mode"+modeId+".png')";
});

audio.onended = function () {
    if (modeId == 2) {
        // 跳转至下一首歌
        musicId = (musicId + 1) % musicData.length;
    }
    else if (modeId == 3) {
        // 随机生成下一首歌的序号
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * musicData.length-1) + 0;
            if (musicId != oldId) { break; }
        }
    }
    initAndPlay();
}

// 上一首
skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = musicData.length-1;
    }
    initAndPlay();
});

// 下一首
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > musicData.length-1) {
        musicId = 0;
    }
    initAndPlay();
});

// 倍速功能（这里直接暴力解决了）
speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});

// MV功能
MV.addEventListener('click', function (event) {
    // 向新窗口传值
    var storage_list = window.sessionStorage;
    storage_list['musicId'] = musicId;
    window.open("video.html");
});

// 暴力捆绑列表音乐
document.getElementById("music0").addEventListener('click', function (event) {
    musicId = 0;
    initAndPlay();
});
document.getElementById("music1").addEventListener('click', function (event) {
    musicId = 1;
    initAndPlay();
});
document.getElementById("music2").addEventListener('click', function (event) {
    musicId = 2;
    initAndPlay();
});
document.getElementById("music3").addEventListener('click', function (event) {
    musicId = 3;
    initAndPlay();
});

document.getElementById("music4").addEventListener('click', function (event) {
    musicId = 4;
    initAndPlay();
});

document.getElementById("music5").addEventListener('click', function (event) {
    musicId = 5;
    initAndPlay();
});

document.getElementById("music6").addEventListener('click', function (event) {
    musicId = 6;
    initAndPlay();
});

document.getElementById("music7").addEventListener('click', function (event) {
    musicId = 7;
    initAndPlay();
});

document.getElementById("music8").addEventListener('click', function (event) {
    musicId = 8;
    initAndPlay();
});

document.getElementById("music9").addEventListener('click', function (event) {
    musicId = 9;
    initAndPlay();
});

document.getElementById("music10").addEventListener('click', function (event) {
    musicId = 10;
    initAndPlay();
});

document.getElementById("music11").addEventListener('click', function (event) {
    musicId = 11;
    initAndPlay();
});

document.getElementById("music12").addEventListener('click', function (event) {
    musicId = 12;
    initAndPlay();
});

document.getElementById("music13").addEventListener('click', function (event) {
    musicId = 13;
    initAndPlay();
});

document.getElementById("music14").addEventListener('click', function (event) {
    musicId = 14;
    initAndPlay();
});

document.getElementById("music15").addEventListener('click', function (event) {
    musicId = 15;
    initAndPlay();
});

document.getElementById("music16").addEventListener('click', function (event) {
    musicId = 16;
    initAndPlay();
});

document.getElementById("music17").addEventListener('click', function (event) {
    musicId = 17;
    initAndPlay();
});

document.getElementById("music18").addEventListener('click', function (event) {
    musicId = 18;
    initAndPlay();
});

document.getElementById("music19").addEventListener('click', function (event) {
    musicId = 19;
    initAndPlay();
});

document.getElementById("music20").addEventListener('click', function (event) {
    musicId = 30;
    initAndPlay();
});

document.getElementById("music21").addEventListener('click', function (event) {
    musicId = 21;
    initAndPlay();
});

document.getElementById("music22").addEventListener('click', function (event) {
    musicId = 22;
    initAndPlay();
});

document.getElementById("music23").addEventListener('click', function (event) {
    musicId = 23;
    initAndPlay();
});

document.getElementById("music24").addEventListener('click', function (event) {
    musicId = 24;
    initAndPlay();
});

document.getElementById("music25").addEventListener('click', function (event) {
    musicId = 25;
    initAndPlay();
});

document.getElementById("music26").addEventListener('click', function (event) {
    musicId = 26;
    initAndPlay();
});

document.getElementById("music27").addEventListener('click', function (event) {
    musicId = 27;
    initAndPlay();
});

document.getElementById("music28").addEventListener('click', function (event) {
    musicId = 28;
    initAndPlay();
});
document.getElementById("music29").addEventListener('click', function (event) {
    musicId = 29;
    initAndPlay();
});


// 刷新唱片旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

// 使唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

// 停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}

// 存储上一次的音量
var lastVolumn = 70

// 滑块调节音量
audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 70;
}

// 点击音量调节设置静音
volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    if (volumeTogger.value == 0) {
        if (lastVolumn == 0) {
            lastVolumn = 70;
        }
        volumeTogger.value = lastVolumn;
        volume.style.backgroundImage = "url('img/音量.png')";
    }
    else {
        lastVolumn = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = "url('img/静音.png')";
    }
}
