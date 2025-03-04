// 扩展配置
const CONFIG = {
  BADGE_TEXT: 'ON',
  LOG_PREFIX: '[Video Autoplay]'
};

// 扩展安装初始化
chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.action.setBadgeText({ text: CONFIG.BADGE_TEXT });
    console.log(`${CONFIG.LOG_PREFIX} 扩展已安装`);
  } catch (error) {
    console.error(`${CONFIG.LOG_PREFIX} 初始化失败:`, error);
  }
});

// 浏览器动作点击事件
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
