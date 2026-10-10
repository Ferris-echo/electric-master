import os
import re
import json
import base64
import mimetypes

BASE_DIR = os.path.dirname(__file__)
WEB_DIR = os.path.join(BASE_DIR, 'web')
DATA_DIR = os.path.join(BASE_DIR, 'data')
DIST_DIR = os.path.join(BASE_DIR, 'dist')
os.makedirs(DIST_DIR, exist_ok=True)

def get_base64_img(rel_path):
    abs_path = os.path.join(BASE_DIR, rel_path.replace('/', os.sep))
    if not os.path.exists(abs_path):
        print(f"Warning: image not found: {abs_path}")
        return rel_path
    
    mime, _ = mimetypes.guess_type(abs_path)
    if not mime:
        mime = 'image/png'
    with open(abs_path, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode('ascii')
    return f"data:{mime};base64,{b64}"

def pack():
    print("Packing single-file offline bundle...")
    
    # 1. Read index.html
    with open(os.path.join(WEB_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()
        
    # 2. Read app.css
    with open(os.path.join(WEB_DIR, 'app.css'), 'r', encoding='utf-8') as f:
        css = f.read()
        
    # 3. Read questions_db.json and convert images to Base64
    with open(os.path.join(DATA_DIR, 'questions_db.json'), 'r', encoding='utf-8') as f:
        papers = json.load(f)
        
    img_cache = {}
    total_imgs = 0
    for p in papers:
        for q in p['questions']:
            new_imgs = []
            for img_path in q.get('images', []):
                if img_path not in img_cache:
                    img_cache[img_path] = get_base64_img(img_path)
                    total_imgs += 1
                new_imgs.append(img_cache[img_path])
            q['images'] = new_imgs

    print(f"Base64 encoded {total_imgs} images into database.")
    papers_json = json.dumps(papers, ensure_ascii=False)
    
    # 4. Read app.js
    with open(os.path.join(WEB_DIR, 'app.js'), 'r', encoding='utf-8') as f:
        js = f.read()

    # 5. Assemble into single HTML
    # Replace <link rel="stylesheet" href="app.css">
    html = re.sub(
        r'<link\s+rel=["\']stylesheet["\']\s+href=["\']app\.css["\']\s*>',
        f'<style>\n{css}\n</style>',
        html
    )
    
    # Replace <script src="../data/questions_db.js"></script> and <script src="app.js"></script>
    inlined_script = f"""
<script>
window.EXAM_PAPERS = {papers_json};
{js}
</script>
"""
    html = re.sub(
        r'<script\s+src=["\'][^"\']*questions_db\.js["\'].*?<script\s+src=["\']app\.js["\']\s*></script>',
        inlined_script,
        html,
        flags=re.S
    )

    out_file = os.path.join(DIST_DIR, '高级电工刷题系统_单文件离线版.html')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
        
    size_mb = os.path.getsize(out_file) / (1024 * 1024)
    print(f"SUCCESS! Single-file bundle created: {out_file}")
    print(f"File size: {size_mb:.2f} MB")

if __name__ == '__main__':
    pack()
