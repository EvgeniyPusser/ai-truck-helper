#!/usr/bin/env python3
import sys, json

def main():
    try:
        data = json.loads(sys.stdin.read() or "{}")
    except Exception as e:
        print(json.dumps({"error": f"bad json: {e}"}))
        sys.exit(1)

    name = data.get("name", "world")
    n = int(data.get("n", 1))
    msg = " ".join([f"hello, {name}!"] * max(1, n))
    print(json.dumps({"ok": True, "message": msg}))

if __name__ == "__main__":
    main()


