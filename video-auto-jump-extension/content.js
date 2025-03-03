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
