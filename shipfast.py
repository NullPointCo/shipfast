#!/usr/bin/env python3
"""shipfast v1.0.0 - SaaS boilerplate generator. NullPointerCo (MIT)"""
import os
import sys
import argparse

VERSION = "1.0.0"
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")

def copy_template(src_dir, dest_name):
    """Copy and customize a template directory"""
    import shutil
    dest = os.path.join(os.getcwd(), dest_name)
    if os.path.exists(dest):
        print(f"Error: '{dest_name}' already exists")
        sys.exit(1)
    shutil.copytree(src_dir, dest)
    # Replace placeholders in all files
    for root, dirs, files in os.walk(dest):
        for fname in files:
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'r') as f:
                    content = f.read()
                content = content.replace("{{PROJECT_NAME}}", dest_name)
                with open(fpath, 'w') as f:
                    f.write(content)
            except (UnicodeDecodeError, PermissionError):
                pass
    lines = len([f for r,d,fs in os.walk(dest) for f in fs])
    print(f"Created {dest_name}/ ({lines} files)")
    print(f"Next: cd {dest_name} && pip install -r requirements.txt")

def main():
    desc = "shipfast - Production-ready SaaS boilerplate generator"
    parser = argparse.ArgumentParser(description=desc)
    sub = parser.add_subparsers(dest="command")
    
    c = sub.add_parser("create", help="Create new project")
    c.add_argument("name", help="Project name")
    c.add_argument("--stack", "-s", default="fastapi-stripe",
                   help="Template stack (default: fastapi-stripe)")
    
    sub.add_parser("list", help="List available templates")
    parser.add_argument("--version", action="version", version=f"shipfast v{VERSION}")
    
    args = parser.parse_args()
    
    if args.command == "list":
        tdir = TEMPLATE_DIR
        if os.path.exists(tdir):
            stacks = [d for d in os.listdir(tdir) if os.path.isdir(os.path.join(tdir, d))]
            print("Available stacks:")
            for s in stacks:
                print(f"  - {s}")
        else:
            print(f"No templates found at {tdir}")
        return
    
    if args.command == "create":
        template_path = os.path.join(TEMPLATE_DIR, args.stack)
        if not os.path.exists(template_path):
            print(f"Template '{args.stack}' not found. Run 'shipfast list' for available stacks.")
            sys.exit(1)
        copy_template(template_path, args.name)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
