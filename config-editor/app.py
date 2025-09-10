#!/usr/bin/env python3
"""
Config Editor - Beautiful Flask Web App for editing config.json
"""

import json
import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
CONFIG_PATH = Path("/app/config/config.json")  # Docker mounted path
BACKUP_PATH = Path(__file__).parent / "backups"

# Ensure backup directory exists
BACKUP_PATH.mkdir(exist_ok=True)

def load_config():
    """Load config.json with error handling"""
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Config file not found"}
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON: {str(e)}"}

def save_config(config_data):
    """Save config.json with backup"""
    try:
        # Create backup
        import datetime
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = BACKUP_PATH / f"config_backup_{timestamp}.json"
        
        # Backup current config if it exists
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                backup_data = f.read()
            with open(backup_file, 'w', encoding='utf-8') as f:
                f.write(backup_data)
        
        # Save new config
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, indent=2, ensure_ascii=False)
        
        return {"success": True, "backup": str(backup_file)}
    except Exception as e:
        return {"error": f"Failed to save: {str(e)}"}

@app.route('/')
def index():
    """Main editor page"""
    return render_template('index.html')

@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current config.json"""
    config = load_config()
    return jsonify(config)

@app.route('/api/config', methods=['POST'])
def update_config():
    """Update config.json"""
    try:
        config_data = request.get_json()
        if not config_data:
            return jsonify({"error": "No data provided"}), 400
        
        result = save_config(config_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/backups')
def list_backups():
    """List available backups"""
    try:
        backups = []
        for backup_file in BACKUP_PATH.glob("config_backup_*.json"):
            stat = backup_file.stat()
            backups.append({
                "filename": backup_file.name,
                "size": stat.st_size,
                "modified": stat.st_mtime
            })
        backups.sort(key=lambda x: x["modified"], reverse=True)
        return jsonify(backups)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/restore/<backup_name>', methods=['POST'])
def restore_backup(backup_name):
    """Restore from backup"""
    try:
        backup_file = BACKUP_PATH / backup_name
        if not backup_file.exists():
            return jsonify({"error": "Backup not found"}), 404
        
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)
        
        result = save_config(backup_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Get host and port from environment variables for production deployment
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"Starting Flask app on {host}:{port} (debug={debug})")
    app.run(debug=debug, host=host, port=port)
