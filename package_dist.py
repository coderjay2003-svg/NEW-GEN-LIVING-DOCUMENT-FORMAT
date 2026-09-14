import os
import shutil
import zipfile
import tarfile

workspace = os.path.dirname(os.path.abspath(__file__))

def package_zip(src_dir, out_zip):
    if not os.path.exists(src_dir):
        return
    os.makedirs(os.path.dirname(out_zip), exist_ok=True)
    tmp_zip = out_zip + '.tmp'
    try:
        with zipfile.ZipFile(tmp_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            for root, dirs, files in os.walk(src_dir):
                if 'node_modules' in dirs: dirs.remove('node_modules')
                if '.git' in dirs: dirs.remove('.git')
                for f in files:
                    if f.endswith(('.zip', '.tar.gz', '.exe.stackdump', '.tmp')): continue
                    p = os.path.join(root, f)
                    z.write(p, os.path.relpath(p, src_dir))
        if os.path.exists(out_zip):
            try: os.remove(out_zip)
            except Exception: pass
        os.replace(tmp_zip, out_zip)
        print(f'  [OK] Created {os.path.basename(out_zip)} ({os.path.getsize(out_zip):,} bytes)')
    except Exception as e:
        if os.path.exists(tmp_zip):
            try: os.remove(tmp_zip)
            except Exception: pass
        print(f'  [WARN] package_zip {os.path.basename(out_zip)}: {e}')

def package_tar(src_dir, out_tar, prefix=''):
    if not os.path.exists(src_dir):
        return
    os.makedirs(os.path.dirname(out_tar), exist_ok=True)
    tmp_tar = out_tar + '.tmp'
    try:
        with tarfile.open(tmp_tar, 'w:gz') as t:
            for root, dirs, files in os.walk(src_dir):
                if 'node_modules' in dirs: dirs.remove('node_modules')
                if '.git' in dirs: dirs.remove('.git')
                for f in files:
                    if f.endswith(('.zip', '.tar.gz', '.tmp')): continue
                    p = os.path.join(root, f)
                    arc = os.path.join(prefix, os.path.relpath(p, src_dir)).replace('\\', '/')
                    t.add(p, arcname=arc)
        if os.path.exists(out_tar):
            try: os.remove(out_tar)
            except Exception: pass
        os.replace(tmp_tar, out_tar)
        print(f'  [OK] Created {os.path.basename(out_tar)} ({os.path.getsize(out_tar):,} bytes)')
    except Exception as e:
        if os.path.exists(tmp_tar):
            try: os.remove(tmp_tar)
            except Exception: pass
        print(f'  [WARN] package_tar {os.path.basename(out_tar)}: {e}')

editor_dir = os.path.join(workspace, 'packages', 'ldoc-editor')
viewer_dir = os.path.join(workspace, 'packages', 'ldoc-viewer')
sdk_dir = os.path.join(workspace, 'packages', 'ldoc-sdk')
ios_dir = os.path.join(workspace, 'ios-xcode-wrapper')

# Windows packages
package_zip(editor_dir, os.path.join(workspace, 'dist', 'ldoc-editor-windows.zip'))
package_zip(viewer_dir, os.path.join(workspace, 'dist', 'ldoc-viewer-windows.zip'))
package_zip(sdk_dir, os.path.join(workspace, 'dist', 'ldoc-dev-sdk.zip'))

# Linux packages
package_tar(editor_dir, os.path.join(workspace, 'linux-dist', 'ldoc-editor-linux.tar.gz'), 'ldoc-editor')
package_tar(viewer_dir, os.path.join(workspace, 'linux-dist', 'ldoc-viewer-linux.tar.gz'), 'ldoc-viewer')
package_tar(sdk_dir, os.path.join(workspace, 'linux-dist', 'ldoc-dev-sdk-linux.tar.gz'), 'ldoc-sdk')
package_zip(editor_dir, os.path.join(workspace, 'linux-dist', 'ldoc-editor-linux.zip'))
package_zip(viewer_dir, os.path.join(workspace, 'linux-dist', 'ldoc-viewer-linux.zip'))

# Mac packages
package_zip(editor_dir, os.path.join(workspace, 'mac-dist', 'ldoc-editor-macos.zip'))
package_zip(viewer_dir, os.path.join(workspace, 'mac-dist', 'ldoc-viewer-macos.zip'))
package_tar(sdk_dir, os.path.join(workspace, 'mac-dist', 'ldoc-dev-sdk-macos.tar.gz'), 'ldoc-sdk')

# iOS packages
package_zip(editor_dir, os.path.join(workspace, 'ios-dist', 'ldoc-editor-ios.zip'))
package_zip(viewer_dir, os.path.join(workspace, 'ios-dist', 'ldoc-viewer-ios.zip'))
if os.path.exists(ios_dir):
    package_zip(ios_dir, os.path.join(workspace, 'ios-dist', 'ldoc-ios-xcode-project.zip'))

# Replicate to downloads/ folders
downloads_dirs = [
    os.path.join(workspace, 'downloads'),
    os.path.join(workspace, 'public', 'downloads'),
    os.path.join(workspace, 'app', 'viewer', 'downloads')
]
for d in downloads_dirs:
    os.makedirs(d, exist_ok=True)
    for src in [
        os.path.join(workspace, 'dist', 'ldoc-editor-windows.zip'),
        os.path.join(workspace, 'dist', 'ldoc-viewer-windows.zip'),
        os.path.join(workspace, 'dist', 'ldoc-dev-sdk.zip'),
        os.path.join(workspace, 'linux-dist', 'ldoc-editor-linux.tar.gz'),
        os.path.join(workspace, 'linux-dist', 'ldoc-viewer-linux.tar.gz'),
        os.path.join(workspace, 'ios-dist', 'ldoc-editor-ios.zip'),
    ]:
        if os.path.exists(src):
            dst = os.path.join(d, os.path.basename(src))
            try:
                if os.path.exists(dst):
                    try: os.remove(dst)
                    except Exception: pass
                shutil.copy2(src, dst)
            except Exception as ce:
                pass

print('All distribution archives packaged and synced.')
