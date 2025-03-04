// 自动跳转并播放视频
function autoPlayVideo() {
  // 查找所有视频元素
  const videos = Array.from(document.querySelectorAll('video'));
  
  if (videos.length > 0) {
    // 查找当前播放的视频
    let currentVideo = videos.find(v => !v.paused || v.currentTime > 0);
    
    // 如果没有正在播放的视频，使用第一个视频
    if (!currentVideo) {
      currentVideo = videos[0];
    }
    
    // 查找下一个视频
    const currentIndex = videos.indexOf(currentVideo);
    const nextVideo = videos[currentIndex + 1];
    
    // 如果当前视频结束且存在下一个视频
    if (currentVideo.ended && nextVideo) {
      currentVideo.pause();
      nextVideo.play();
      console.log('自动跳转到下一个视频');
      return;
    }
    
    // 播放当前视频
    try {
      currentVideo.play();
      console.log('视频自动播放成功');
      
      // 监听结束事件
      currentVideo.addEventListener('ended', () => {
        if (nextVideo) {
          nextVideo.play();
          console.log('视频结束，自动播放下一个视频');
        }
      });
    } catch (error) {
      console.error('自动播放失败:', error);
    }
  } else {
    console.log('未找到视频元素');
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
    console.log('达到最大重试次数');
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

// 配置常量
const CONFIG = {
  SELECTORS: {
    VIDEO: 'video',
    PLAYER_CONTAINER: '.player-container, .video-wrapper, [role="main"]',
    NEXT_BUTTON: [
      '.next-button', '.next-episode', '.next',
      '[aria-label="下一集"]', '[title*="下一集"]',
      '[aria-label="Next"]', '[title*="Next"]'
    ],
    PLAYLIST: [
      '.episode-list', '.playlist-items', '.list-wrapper',
      '.chapter-list', '.tab-episodes', '.video-list',
      '[aria-label="播放列表"]', '[id*="playlist"]'
    ]
  },
  TIMING: {
    INIT_DELAY: 1000,
    RELOAD_CHECK: 3000,
    VOLUME_CHECK: 2000
  },
  LOG_PREFIX: '[视频自动跳转]'
};

// 增强版视频控制逻辑
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

// 初始化执行
enhancedVideoControl();
