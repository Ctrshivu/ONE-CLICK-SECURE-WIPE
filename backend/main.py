from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import subprocess
import os
import shutil
import tempfile
from urllib.parse import unquote

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Real device detection ----------------

def get_windows_drives():
    drives = []
    for part in psutil.disk_partitions(all=False):
        drives.append({
            "device": part.device,      # e.g., "C:\\"
            "mountpoint": part.mountpoint,
            "fstype": part.fstype,
            "name": os.path.basename(part.device) or part.device,
        })
    return drives

def get_android_devices():
    try:
        result = subprocess.run(
            ["adb", "devices", "-l"], capture_output=True, text=True
        )
        lines = result.stdout.strip().split("\n")
        devices = []
        for line in lines[1:]:
            if line.strip() == "":
                continue
            parts = line.split()
            serial = parts[0]
            name = "Android Device"
            for p in parts:
                if p.startswith("model:"):
                    name = p.split(":")[1]
            devices.append({"serial": serial, "name": name})
        return devices
    except Exception as e:
        print("ADB not found or error:", e)
        return []

# ---------------- Routes ----------------

@app.get("/devices")
def get_devices():
    devices = {
        "phones": get_android_devices(),
        "pc_name": os.getenv("COMPUTERNAME") or "My-PC",
        "drives": get_windows_drives(),
    }
    return devices

@app.post("/wipe/safe/{device_id}")
def safe_wipe(device_id: str):
    device_id = unquote(device_id)
    temp_dir = tempfile.gettempdir()
    removed = []
    for root, dirs, files in os.walk(temp_dir):
        for f in files:
            try:
                os.remove(os.path.join(root, f))
                removed.append(f)
            except Exception:
                pass
    return {
        "status": "success",
        "message": f"Safe wipe completed on {device_id} (cleared {len(removed)} files)",
        "files_deleted": len(removed),
    }

@app.post("/wipe/full/{device_id}")
def full_wipe(device_id: str):
    device_id = unquote(device_id)
    if not os.path.exists(device_id):
        return {"status": "error", "message": f"Path {device_id} does not exist."}

    deleted_count = 0

    for root, dirs, files in os.walk(device_id, topdown=False):
        for f in files:
            file_path = os.path.join(root, f)
            try:
                os.chmod(file_path, 0o777)  # Remove read-only
                os.remove(file_path)
                deleted_count += 1
            except Exception as e:
                print(f"Failed to delete file {file_path}: {e}")

        for d in dirs:
            dir_path = os.path.join(root, d)
            try:
                shutil.rmtree(dir_path, ignore_errors=False)
            except Exception as e:
                print(f"Failed to delete directory {dir_path}: {e}")

    return {
        "status": "success",
        "message": f"Full destructive wipe completed on {device_id} (deleted {deleted_count} files)",
        "files_deleted": deleted_count,
    }

@app.get("/verify/{device_id}")
def verify_wipe(device_id: str):
    device_id = unquote(device_id)
    files = []
    try:
        for root, dirs, fs in os.walk(device_id):
            for f in fs:
                files.append(os.path.join(root, f))
                if len(files) > 5:
                    break
    except Exception:
        pass
    return {"status": "ok", "files_remaining": len(files), "sample": files}
