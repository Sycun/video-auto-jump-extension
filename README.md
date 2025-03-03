# Video Auto Jump Extension

一个自动播放和跳转视频的浏览器扩展。

## 功能特性
- 自动检测页面中的视频元素
- 自动播放第一个视频
- 当前视频结束后自动播放下一个视频
- 页面变化时自动检测新视频
- 包含重试机制，确保播放可靠性

## 安装说明
1. 下载项目代码
2. 打开Chrome浏览器，进入`chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择项目目录

## 使用方法
1. 安装扩展后，打开包含多个视频的网页
2. 扩展会自动播放第一个视频
3. 当前视频结束后会自动播放下一个视频
4. 页面加载新视频时会自动检测并播放

## 贡献指南
欢迎提交issue和pull request。请遵循以下步骤：
1. Fork项目
2. 创建新分支 (`git checkout -b feature/YourFeature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/YourFeature`)
5. 创建Pull Request

## 许可证
本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。
