document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('statusText');

  // 从存储加载开关状态
  chrome.storage.local.get(['extensionEnabled'], function(data) {
    const isEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    toggleSwitch.checked = isEnabled;
    statusText.textContent = isEnabled ? '已启用' : '已禁用';
  });

  // 监听开关变化
  toggleSwitch.addEventListener('change', function() {
    const isEnabled = this.checked;
    chrome.storage.local.set({ extensionEnabled: isEnabled }, function() {
      statusText.textContent = isEnabled ? '已启用' : '已禁用';
      // 向后台发送状态更新
      chrome.runtime.sendMessage({ action: 'toggleExtension', enabled: isEnabled });
    });
  });
});

// 错误处理
chrome.runtime.onMessage.addListener(function(message) {
  if (message.error) {
    statusText.textContent = '状态同步失败';
    console.error('扩展状态更新错误:', message.error);
  }
});