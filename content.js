// 自动跳转并播放视频
// 功能：自动检测页面视频元素，实现自动播放、跨视频跳转、音量记忆等功能
function autoPlayVideo() {
  // 步骤1：查找所有视频元素
  const videos = Array.from(document.querySelectorAll('video'));
  
  if (videos.length > 0) {
    // 步骤2：确定当前活动视频（正在播放或最近播放）
    let currentVideo = videos.find(v => !v.paused || v.currentTime > 0);
    
    // 后备策略：若无活动视频则选择第一个
    if (!currentVideo) {
      currentVideo = videos[0];
    }

    // 步骤3：确定下一个待播视频
    const currentIndex = videos.indexOf(currentVideo);
    const nextVideo = videos[currentIndex + 1];

    // 跨视频跳转条件：当前视频结束且存在后续视频
    if (currentVideo.ended && nextVideo) {
      currentVideo.pause();
      nextVideo.play();
      console.log('自动跳转到下一个视频');
      return;
    }

    // 核心播放逻辑
    try {
      currentVideo.play();
      
      // 事件监听：视频结束自动触发下一集
      currentVideo.addEventListener('ended', () => {
        if (nextVideo) {
          nextVideo.play();
        }
      });

    } catch (error) {
      console.error('自动播放失败:', error);
    }
  }
}

// 配置参数说明
const CONFIG = {
  // 视频相关元素选择器
  SELECTORS: {
    VIDEO: 'video', // 主视频元素选择器
    NEXT_BUTTON: [ // 下一集按钮匹配规则
      '[aria-label="下一集"]', // 中文aria标签
      '[title*="Next"]',        // 英文标题包含Next
      '.next-button',           // 其他可能的选择器
      '.next-episode',
      '.next'
    ],
    PLAYLIST: [
      '[id*="playlist"]',       // 播放列表容器
      '.episode-list',
      '.playlist-items',
      '.list-wrapper',
      '.chapter-list',
      '.tab-episodes',
      '.video-list',
      '[aria-label="播放列表"]'
    ],
    PLAYER_CONTAINER: '.player-container, .video-wrapper, [role="main"]' // 播放器容器
  },
  
  // 时间控制参数（单位：毫秒）
  TIMING: {
    INIT_DELAY: 1000,    // 初始加载延迟
    RELOAD_CHECK: 3000,  // 页面重载检测间隔
    VOLUME_CHECK: 2000   // 音量状态保存间隔
  },
  
  // 日志前缀标识
  LOG_PREFIX: '[视频自动跳转]' 
};

// 自动跳转并播放视频
// 功能：自动检测页面视频元素，实现自动播放、跨视频跳转、音量记忆等功能
function autoPlayVideo() {
  // 步骤1：查找所有视频元素
  const videos = Array.from(document.querySelectorAll('video'));
  
  if (videos.length > 0) {
    // 步骤2：确定当前活动视频（正在播放或最近播放）
    let currentVideo = videos.find(v => !v.paused || v.currentTime > 0);
    
    // 后备策略：若无活动视频则选择第一个
    if (!currentVideo) {
      currentVideo = videos[0];
    }

    // 步骤3：确定下一个待播视频
    const currentIndex = videos.indexOf(currentVideo);
    const nextVideo = videos[currentIndex + 1];

    // 跨视频跳转条件：当前视频结束且存在后续视频
    if (currentVideo.ended && nextVideo) {
      currentVideo.pause();
      nextVideo.play();
      console.log(`${CONFIG.LOG_PREFIX} 自动跳转到下一个视频`);
      return;
    }

    // 核心播放逻辑
    try {
      currentVideo.play();
      
      // 事件监听：视频结束自动触发下一集
      currentVideo.addEventListener('ended', () => {
        if (nextVideo) {
          nextVideo.play();
        }
      });

    } catch (error) {
      console.error(`${CONFIG.LOG_PREFIX} 自动播放失败:`, error);
    }
  }
}

// 增强版视频控制器
// 功能：集成音量记忆、智能跳转、异常重试等进阶功能
function enhancedVideoControl() {
  const video = document.querySelector(CONFIG.SELECTORS.VIDEO);
  
  if (video) {
    // 初始化音量设置
    if (localStorage.getItem('videoVolume')) {
      video.volume = parseFloat(localStorage.getItem('videoVolume'));
    }

    // 自动播放处理
    const tryPlay = () => {
      try {
        video.play();
        console.log(`${CONFIG.LOG_PREFIX} 视频自动播放成功`);
        
        video.addEventListener('ended', handleVideoEnd);
        video.addEventListener('volumechange', () => {
          localStorage.setItem('videoVolume', video.volume);
        });
      } catch (error) {
        console.error(`${CONFIG.LOG_PREFIX} 播放失败:`, error);
        setTimeout(tryPlay, 1000);
      }
    };

    // 视频结束处理
    const handleVideoEnd = () => {
      const nextButton = document.querySelector(CONFIG.SELECTORS.NEXT_BUTTON);
      if (nextButton) {
        nextButton.click();
        console.log(`${CONFIG.LOG_PREFIX} 自动跳转下一集`);
      } else {
        const playlist = document.querySelector(CONFIG.SELECTORS.PLAYLIST);
        if (playlist) {
          const currentIndex = Array.from(playlist.children).findIndex(
            item => item.classList.contains('active')
          );
          if (currentIndex > -1 && playlist.children[currentIndex + 1]) {
            playlist.children[currentIndex + 1].click();
          }
        }
      }
    };

    // 启动播放
    if (video.paused) {
      setTimeout(tryPlay, CONFIG.TIMING.INIT_DELAY);
    }
  }
}

// 初始尝试
autoPlayVideo();

// 设置重试机制
let retryCount = 0;
const maxRetries = 5;
const retryInterval = 1000; // 1秒

const retryTimer = setInterval(() => {
  if (retryCount >= maxRetries) {
    clearInterval(retryTimer);
    console.log(`${CONFIG.LOG_PREFIX} 达到最大重试次数`);
    return;
  }
  
  autoPlayVideo();
  retryCount++;
}, retryInterval);

// 监听页面变化
const observer = new MutationObserver(autoPlayVideo);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 初始化执行
enhancedVideoControl();