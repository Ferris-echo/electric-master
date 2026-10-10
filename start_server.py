import os
import sys
import socket
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't even have to be reachable
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
    
    server_address = ('', port)
    try:
        httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    except OSError:
        port = 8088
        server_address = ('', port)
        httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

    local_url = f"http://localhost:{port}"
    lan_url = f"http://{ip}:{port}"

    print("=" * 65)
    print("   ⚡ 高级电工理论考试跨平台刷题服务已启动 ⚡")
    print("=" * 65)
    print(f"💻 电脑本机直接访问:   {local_url}")
    print(f"📱 手机/平板局域网访问: {lan_url}")
    print("=" * 65)
    print("【使用提示】")
    print(" 1. 确保手机/平板与此电脑连接在同一个 Wi-Fi (或手机开热点连电脑)")
    print(f" 2. 手机打开 Safari 或手机浏览器输入: {lan_url}")
    print(" 3. 苹果(iOS)用户: 点击 Safari 底部分享 -> '添加到主屏幕' 秒变独立 App")
    print(" 4. 安卓(Android)用户: 点击浏览器菜单 -> '安装应用' 或 '添加到桌面'")
    print(" 5. 按 Ctrl + C 可随时退出服务")
    print("=" * 65)
    print()

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
