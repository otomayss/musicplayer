// 1. 统一DOM元素获取（按功能分组，便于维护）
const dom = {
  body: document.getElementById('body'),
  audio: document.getElementById('audioTag'),
  // 歌曲信息
  musicTitle: document.getElementById('music-title'),
  recordImg: document.getElementById('record-img'),
  author: document.getElementById('author-name'),
  // 进度条相关
  progress: document.getElementById('progress'),
  progressTotal: document.getElementById('progress-total'),
  playedTime: document.getElementById('playedTime'),
  audioTime: document.getElementById('audioTime'),
  // 控制按钮
  mode: document.getElementById('playMode'),
  skipForward: document.getElementById('skipForward'), // 上一首
  playPause: document.getElementById('playPause'),    // 暂停/播放（原pause，命名更清晰）
  skipBackward: document.getElementById('skipBackward'), // 下一首
  volume: document.getElementById('volume'),
  volumeTogger: document.getElementById('volumn-togger'), // 注意：原拼写volumn应为volume，建议HTML同步修改
  // 其他功能
  list: document.getElementById('list'),
  speed: document.getElementById('speed'),
  MV: document.getElementById('MV'),
  closeList: document.getElementById('close-list'),
  musicList: document.getElementById('music-list')
};

// 2. 状态变量集中管理（避免全局变量散乱）
const state = {
  musicId: 0,          // 当前播放歌曲序号
  modeId: 1,           // 播放模式（1-单曲循环，2-列表循环，3-随机播放）
  lastVolume: 70,      // 上一次音量（原lastVolumn，统一拼写）
  playbackRates: [0.5, 1.0, 1.5, 2.0], // 倍速选项（便于循环切换）
  currentSpeedIndex: 1 // 当前倍速索引（对应playbackRates，默认1.0X）
};

// 3. 歌曲数据（建议扩展结构，支持自定义封面/背景，更灵活）
const musicData = [
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
  ['周慧敏-最爱', '周慧敏-最爱'],
  ['欢喜就好', '陈雷']
];

// 4. 工具函数（通用功能抽离，避免重复）
/**
 * 时间格式转换（秒 → 00:00 或 00:00:00）
 * @param {number} value - 音频时间（秒）
 * @returns {string} 格式化后的时间字符串
 */
function transTime(value) {
  const h = Math.floor(value / 3600);
  const m = Math.floor((value % 3600) / 60);
  const s = Math.floor(value % 60);
  // 补零逻辑简化（使用String.padStart）
  const format = (num) => String(num).padStart(2, '0');
  
  return h > 0 
    ? `${format(h)}:${format(m)}:${format(s)}` 
    : `${format(m)}:${format(s)}`;
}

/**
 * 唱片旋转控制
 * @param {boolean} isRunning - 是否运行（true-播放，false-暂停）
 */
function controlRecordRotate(isRunning) {
  dom.recordImg.style.animationPlayState = isRunning ? "running" : "paused";
}

// 5. 核心音乐功能
/**
 * 初始化音乐（设置音频源、更新歌曲信息）
 */
function initMusic() {
  const { musicId } = state;
  // 设置音频源（拼接逻辑简化）
  dom.audio.src = `mp3/music${musicId}.mp3`;
  dom.audio.load();
  
  // 移除旋转类（避免重复添加）
  dom.recordImg.classList.remove('rotate-play');
  
  // 音频时长加载完成后更新信息
  dom.audio.ondurationchange = function () {
    const [title, singer] = musicData[musicId];
    dom.musicTitle.innerText = title;
    dom.author.innerText = singer;
    // 封面/背景：若后续支持自定义，可在musicData中添加字段（如[title, singer, cover, bg]）
    dom.recordImg.style.backgroundImage = "url('img/record1.jpg')";
    dom.body.style.backgroundImage = "url('img/bg0.png')";
    
    // 更新时长和进度条
    dom.audioTime.innerText = transTime(dom.audio.duration);
    dom.audio.currentTime = 0;
    updateProgress();
    
    // 恢复唱片旋转状态
    dom.recordImg.classList.add('rotate-play');
    controlRecordRotate(!dom.audio.paused);
  };
}

/**
 * 初始化并播放音乐
 */
function initAndPlay() {
  initMusic();
  // 更新播放按钮状态
  dom.playPause.classList.remove('icon-play');
  dom.playPause.classList.add('icon-pause');
  // 播放音频并旋转唱片
  dom.audio.play();
  controlRecordRotate(true);
}

/**
 * 更新进度条
 */
function updateProgress() {
  const { currentTime, duration } = dom.audio;
  const progressRate = currentTime / duration || 0; // 避免NaN
  dom.progress.style.width = `${progressRate * 100}%`;
  dom.playedTime.innerText = transTime(currentTime);
}

/**
 * 更新音量（修复原逻辑bug：原timeupdate监听会频繁触发，改为滑块change监听）
 */
function updateVolume() {
  const volumeValue = dom.volumeTogger.value;
  dom.audio.volume = volumeValue / 100; // 音量范围0-1，用100更直观（建议HTML滑块max设为100）
  
  // 同步更新音量图标
  dom.volume.style.backgroundImage = volumeValue == 0 
    ? "url('img/静音.png')" 
    : "url('img/音量.png')";
}

// 6. 事件监听绑定（统一管理，避免散落在代码中）
function bindEvents() {
  // 6.1 暂停/播放按钮
  dom.playPause.addEventListener('click', function () {
    if (dom.audio.paused) {
      dom.audio.play();
      controlRecordRotate(true);
      this.classList.remove('icon-play');
      this.classList.add('icon-pause');
    } else {
      dom.audio.pause();
      controlRecordRotate(false);
      this.classList.remove('icon-pause');
      this.classList.add('icon-play');
    }
  });

  // 6.2 音频时间更新（进度条）
  dom.audio.addEventListener('timeupdate', updateProgress);

  // 6.3 点击进度条跳转
  dom.progressTotal.addEventListener('mousedown', function (e) {
    // 只有音频加载完成后才允许跳转（避免duration为NaN）
    if (dom.audio.duration) {
      const pgsWidth = this.offsetWidth; // 简化获取宽度方式
      const rate = e.offsetX / pgsWidth;
      dom.audio.currentTime = dom.audio.duration * rate;
      updateProgress();
    }
  });

  // 6.4 音乐列表展开/关闭（优化事件绑定：closeList只需绑定一次）
  dom.list.addEventListener('click', function () {
    dom.musicList.classList.replace("list-card-hide", "list-card-show");
    dom.musicList.style.display = "flex";
    dom.closeList.style.display = "flex";
  });

  dom.closeList.addEventListener('click', function () {
    dom.musicList.classList.replace("list-card-show", "list-card-hide");
    this.style.display = "none";
  });

  // 6.5 播放模式切换（简化模式切换逻辑）
  dom.mode.addEventListener('click', function () {
    state.modeId = (state.modeId % 3) + 1; // 循环1→2→3→1
    this.style.backgroundImage = `url('img/mode${state.modeId}.png')`;
  });

  // 6.6 音频播放结束（优化随机播放逻辑，避免死循环）
  dom.audio.addEventListener('ended', function () {
    const { modeId, musicId } = state;
    const musicCount = musicData.length;

    switch (modeId) {
      case 2: // 列表循环
        state.musicId = (musicId + 1) % musicCount;
        break;
      case 3: // 随机播放（修复原逻辑bug：Math.random范围错误）
        let newId;
        // 若只有1首歌，无需随机
        if (musicCount === 1) {
          newId = 0;
        } else {
          // 确保新ID与旧ID不同
          do {
            newId = Math.floor(Math.random() * musicCount);
          } while (newId === musicId);
        }
        state.musicId = newId;
        break;
      // case 1: 单曲循环（无需修改musicId，initMusic会重新加载当前歌曲）
    }

    initAndPlay();
  });

  // 6.7 上一首
  dom.skipForward.addEventListener('click', function () {
    state.musicId = (state.musicId - 1 + musicData.length) % musicData.length;
    initAndPlay();
  });

  // 6.8 下一首
  dom.skipBackward.addEventListener('click', function () {
    state.musicId = (state.musicId + 1) % musicData.length;
    initAndPlay();
  });

  // 6.9 倍速切换（简化逻辑，基于数组循环）
  dom.speed.addEventListener('click', function () {
    const { playbackRates, currentSpeedIndex } = state;
    // 循环切换倍速索引
    state.currentSpeedIndex = (currentSpeedIndex + 1) % playbackRates.length;
    const currentSpeed = playbackRates[state.currentSpeedIndex];
    // 更新UI和音频倍速
    this.innerText = `${currentSpeed}X`;
    dom.audio.playbackRate = currentSpeed;
  });

  // 6.10 MV功能（简化存储逻辑）
  dom.MV.addEventListener('click', function () {
    sessionStorage.setItem('musicId', state.musicId);
    window.open("video.html");
  });

  // 6.11 音乐列表项点击（核心优化：循环绑定，替代手动重复代码）
  musicData.forEach((_, index) => {
    const musicItem = document.getElementById(`music${index}`);
    // 容错：若DOM不存在，避免报错
    if (musicItem) {
      musicItem.addEventListener('click', function () {
        state.musicId = index;
        initAndPlay();
      });
    }
  });

  // 6.12 音量调节（修复原逻辑：timeupdate监听改为滑块change监听，避免频繁触发）
  dom.volumeTogger.addEventListener('input', updateVolume); // input实时更新，change松开后更新

  // 6.13 静音切换
  dom.volume.addEventListener('click', function () {
    const { volumeTogger } = dom;
    const { lastVolume } = state;

    if (volumeTogger.value == 0) {
      // 恢复音量（若上次也是0，默认恢复70）
      volumeTogger.value = lastVolume || 70;
    } else {
      // 保存当前音量并静音
      state.lastVolume = volumeTogger.value;
      volumeTogger.value = 0;
    }

    // 同步更新音量
    updateVolume();
  });
}

// 7. 初始化（入口函数，统一启动）
function init() {
  // 初始化倍速显示
  dom.speed.innerText = `${state.playbackRates[state.currentSpeedIndex]}X`;
  // 初始化音乐
  initMusic();
  // 绑定所有事件
  bindEvents();
}

// 启动应用
init();
