import os
import sys
import socket
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Ensure stdout/stderr handles Unicode without crashing on Windows
if sys.platform.startswith('win'):
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def run_server():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir = os.path.join(base_dir, 'web')
    os.chdir(web_dir)
    
    ip = get_local_ip()
    port = 8080
    
    try:
        httpd = HTTPServer(('', port), SimpleHTTPRequestHandler)
    except OSError:
        port = 8088
        httpd = HTTPServer(('', port), SimpleHTTPRequestHandler)

    local_url = f"http://localhost:{port}"
    lan_url = f"http://{ip}:{port}"

    print("=" * 65)
    print("   [+] 高级电工理论考试跨平台刷题服务已成功启动 [+]")
    print("=" * 65)
    print(f"  [电脑本机访问]   {local_url}")
    print(f"  [手机/平板访问]  {lan_url}")
    print("=" * 65)
    print("【使用提示】")
    print(" 1. 手机/平板需与此电脑连接在同一个 Wi-Fi (或连接电脑开的热点)")
    print(f" 2. 手机打开浏览器直接输入: {lan_url}")
    print(" 3. 苹果(iOS)用户: 点击 Safari 底部分享 -> '添加到主屏幕' 秒变独立 App")
    print(" 4. 安卓(Android)用户: 点击浏览器菜单 -> '安装应用' 或 '添加到桌面'")
    print(" 5. 按 Ctrl + C 可随时退出服务")
    print("=" * 65)
    print()
    sys.stdout.flush()

    # Automatically open local browser
    try:
        webbrowser.open(local_url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已安全停止。")
        sys.exit(0)

if __name__ == '__main__':
    run_server()
