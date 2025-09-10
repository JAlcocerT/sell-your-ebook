/**
 * Config Editor - JavaScript Application
 */

class ConfigEditor {
    constructor() {
        this.originalConfig = null;
        this.currentConfig = null;
        this.isDirty = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadConfig();
        this.loadBackups();
    }

    bindEvents() {
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => this.saveConfig());
        
        // Reload button
        document.getElementById('reloadBtn').addEventListener('click', () => this.loadConfig());
        
        // Format JSON button
        document.getElementById('formatJson').addEventListener('click', () => this.formatJSON());
        
        // Validate JSON button
        document.getElementById('validateJson').addEventListener('click', () => this.validateJSON());
        
        // Reset changes button
        document.getElementById('resetChanges').addEventListener('click', () => this.resetChanges());
        
        // JSON editor change detection
        document.getElementById('jsonEditor').addEventListener('input', () => this.onEditorChange());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    async loadConfig() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/config');
            const config = await response.json();
            
            if (config.error) {
                this.showError(`Failed to load config: ${config.error}`);
                return;
            }
            
            this.originalConfig = config;
            this.currentConfig = JSON.parse(JSON.stringify(config)); // Deep copy
            this.updateEditor();
            this.updateFileInfo();
            this.isDirty = false;
            this.updateSaveButton();
            
        } catch (error) {
            this.showError(`Network error: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    async saveConfig() {
        try {
            const jsonText = document.getElementById('jsonEditor').value;
            const config = JSON.parse(jsonText);
            
            this.showLoading(true);
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });
            
            const result = await response.json();
            
            if (result.error) {
                this.showError(`Failed to save: ${result.error}`);
                return;
            }
            
            this.originalConfig = config;
            this.currentConfig = JSON.parse(JSON.stringify(config));
            this.isDirty = false;
            this.updateSaveButton();
            this.showSuccess(`Config saved successfully! Backup created: ${result.backup}`);
            this.loadBackups(); // Refresh backup list
            
        } catch (error) {
            if (error instanceof SyntaxError) {
                this.showError('Invalid JSON syntax. Please fix errors before saving.');
            } else {
                this.showError(`Save failed: ${error.message}`);
            }
        } finally {
            this.showLoading(false);
        }
    }

    async loadBackups() {
        try {
            const response = await fetch('/api/backups');
            const backups = await response.json();
            
            if (backups.error) {
                console.error('Failed to load backups:', backups.error);
                return;
            }
            
            this.renderBackups(backups);
            
        } catch (error) {
            console.error('Failed to load backups:', error);
        }
    }

    async restoreBackup(backupName) {
        if (!confirm(`Are you sure you want to restore from backup "${backupName}"? This will overwrite the current config.`)) {
            return;
        }
        
        try {
            this.showLoading(true);
            const response = await fetch(`/api/restore/${backupName}`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.error) {
                this.showError(`Failed to restore: ${result.error}`);
                return;
            }
            
            this.showSuccess('Backup restored successfully!');
            this.loadConfig(); // Reload the config
            
        } catch (error) {
            this.showError(`Restore failed: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    renderBackups(backups) {
        const container = document.getElementById('backupList');
        
        if (backups.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-4">No backups available</div>';
            return;
        }
        
        container.innerHTML = backups.map(backup => {
            const date = new Date(backup.modified * 1000);
            const sizeKB = Math.round(backup.size / 1024);
            
            return `
                <div class="backup-item p-3 border border-gray-200 rounded-lg" onclick="configEditor.restoreBackup('${backup.filename}')">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium text-sm text-gray-900">${backup.filename.replace('config_backup_', '').replace('.json', '')}</div>
                            <div class="text-xs text-gray-500">${date.toLocaleString()}</div>
                        </div>
                        <div class="text-xs text-gray-400">${sizeKB}KB</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateEditor() {
        const editor = document.getElementById('jsonEditor');
        editor.value = JSON.stringify(this.currentConfig, null, 2);
        this.highlightJSON();
    }

    updateFileInfo() {
        const configStr = JSON.stringify(this.currentConfig);
        const sizeKB = Math.round(new Blob([configStr]).size / 1024);
        
        document.getElementById('fileSize').textContent = `${sizeKB} KB`;
        document.getElementById('lastModified').textContent = new Date().toLocaleString();
        document.getElementById('fileStatus').textContent = this.isDirty ? 'Modified' : 'Saved';
        document.getElementById('fileStatus').className = this.isDirty ? 'text-orange-600' : 'text-green-600';
    }

    updateSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = !this.isDirty;
        saveBtn.className = this.isDirty 
            ? 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors'
            : 'bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors cursor-not-allowed';
    }

    onEditorChange() {
        this.isDirty = true;
        this.updateSaveButton();
        this.updateFileInfo();
    }

    formatJSON() {
        try {
            const jsonText = document.getElementById('jsonEditor').value;
            const parsed = JSON.parse(jsonText);
            document.getElementById('jsonEditor').value = JSON.stringify(parsed, null, 2);
            this.highlightJSON();
            this.showSuccess('JSON formatted successfully!');
        } catch (error) {
            this.showError('Invalid JSON - cannot format');
        }
    }

    validateJSON() {
        try {
            const jsonText = document.getElementById('jsonEditor').value;
            JSON.parse(jsonText);
            this.showSuccess('JSON is valid!');
        } catch (error) {
            this.showError(`JSON validation failed: ${error.message}`);
        }
    }

    resetChanges() {
        if (!this.isDirty) return;
        
        if (confirm('Are you sure you want to discard all changes?')) {
            this.currentConfig = JSON.parse(JSON.stringify(this.originalConfig));
            this.updateEditor();
            this.isDirty = false;
            this.updateSaveButton();
            this.updateFileInfo();
            this.showSuccess('Changes reset successfully!');
        }
    }

    highlightJSON() {
        // Simple JSON syntax highlighting
        const editor = document.getElementById('jsonEditor');
        const text = editor.value;
        
        // This is a basic implementation - you could use a proper syntax highlighter
        // For now, we'll just ensure the text is properly formatted
    }

    handleKeyboardShortcuts(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (this.isDirty) {
                this.saveConfig();
            }
        }
        
        // Ctrl+R to reload
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.loadConfig();
        }
        
        // Ctrl+Shift+F to format
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            this.formatJSON();
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.toggle('hidden', !show);
    }

    showSuccess(message) {
        this.hideMessages();
        const statusBar = document.getElementById('statusBar');
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusBar.classList.remove('hidden');
        statusBar.classList.add('fade-in');
        
        setTimeout(() => {
            statusBar.classList.add('fade-out');
            setTimeout(() => statusBar.classList.add('hidden'), 300);
        }, 3000);
    }

    showError(message) {
        this.hideMessages();
        const errorBar = document.getElementById('errorBar');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorBar.classList.remove('hidden');
        errorBar.classList.add('fade-in');
        
        setTimeout(() => {
            errorBar.classList.add('fade-out');
            setTimeout(() => errorBar.classList.add('hidden'), 300);
        }, 5000);
    }

    hideMessages() {
        document.getElementById('statusBar').classList.add('hidden');
        document.getElementById('errorBar').classList.add('hidden');
    }
}

// Initialize the application
let configEditor;
document.addEventListener('DOMContentLoaded', () => {
    configEditor = new ConfigEditor();
});
