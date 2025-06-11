const { spawn } = require('child_process');
const waitOn = require('wait-on');

console.log('🚀 启动热重载开发环境...');
console.log('📦 启动webpack开发服务器...');
//先构建
const webpackDev = spawn('npm', ['run', 'build:renderer:dev'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

// 添加前缀并输出 stdout
webpackDev.stdout.on('data', data => {
  process.stdout.write(`[webpack-dev-build-renderer] ${data}`);
});

// 添加前缀并输出 stderr
webpackDev.stderr.on('data', data => {
  process.stderr.write(`[webpack-dev-build-renderer] ${data}`);
});
// 等待开发服务器就绪，然后启动Electron
waitOn({
  resources: ['http://localhost:3000'],
  delay: 1000,
  timeout: 30000,
  interval: 1000,
  window: 1000,
})
  .then(() => {
    console.log('[dev-start]✅ Webpack开发服务器已就绪，启动Electron...');

    const electron = spawn('npm', ['run', 'start:dev'], {
      stdio: 'inherit',
      shell: true,
    });

    // 处理进程退出
    process.on('SIGINT', () => {
      console.log('\n[dev-start]🛑 正在关闭开发环境...');
      webpackDev.kill();
      electron.kill();
      process.exit(0);
    });

    electron.on('close', () => {
      console.log('[dev-start]🔄Electron已关闭，停止webpack开发服务器...');
      webpackDev.kill();
      process.exit(0);
    });
  })
  .catch(err => {
    console.error('[dev-start]❌ 启动失败:', err);
    webpackDev.kill();
    process.exit(1);
  });
