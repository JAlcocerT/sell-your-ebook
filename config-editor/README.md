# Config Editor

A beautiful, modern Flask web application for editing the `config.json` file of your Astro ebook landing page.

## Features

- 🎨 **Beautiful Modern UI** - Clean, responsive interface with Tailwind CSS
- 📝 **Real-time JSON Editing** - Syntax highlighting and validation
- 💾 **Auto-backup** - Automatic backups before saving changes
- 🔄 **Restore from Backup** - Easy restoration of previous versions
- ⌨️ **Keyboard Shortcuts** - Ctrl+S to save, Ctrl+R to reload, Ctrl+Shift+F to format
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Docker Ready** - Fully containerized with Docker Compose

## Quick Start

```sh
uv run app.py
```

### Using Docker (Recommended)

```bash
# Start the config editor
make config-editor

# Or start all services (Astro dev + Config Editor)
make all
```

Access the editor at: **http://localhost:5000**

### Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

## Usage

1. **Open the Editor**: Navigate to http://localhost:5000
2. **Edit JSON**: Use the large text area to edit your configuration
3. **Format JSON**: Click "Format JSON" to beautify the code
4. **Validate**: Click "Validate JSON" to check for syntax errors
5. **Save**: Click "Save Changes" or use Ctrl+S
6. **Backup**: Automatic backups are created before each save
7. **Restore**: Use the backup list to restore previous versions

## Keyboard Shortcuts

- `Ctrl + S` - Save changes
- `Ctrl + R` - Reload configuration
- `Ctrl + Shift + F` - Format JSON

## File Structure

```
config-editor/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Main editor template
├── static/
│   ├── css/
│   │   └── style.css  # Custom styles
│   └── js/
│       └── app.js     # Frontend JavaScript
└── backups/           # Automatic backups (created automatically)
```

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `GET /api/backups` - List available backups
- `POST /api/restore/<backup_name>` - Restore from backup

## Docker Integration

The config editor is integrated with the main Docker Compose setup:

```yaml
config-editor:
  image: python:3.11-slim
  ports:
    - "5000:5000"
  volumes:
    - ./config-editor:/app
    - ./landing-page-book-astro-tailwind/src:/app/config
```

## Security Notes

- The editor runs in development mode by default
- For production, set `FLASK_ENV=production`
- Consider adding authentication for production use
- Backups are stored locally in the `backups/` directory

## Troubleshooting

### Config file not found
- Ensure the Astro project is properly mounted in Docker
- Check that `config.json` exists in `landing-page-book-astro-tailwind/src/`

### Permission errors
- The Docker container runs with appropriate permissions
- If issues persist, check Docker volume mounts

### JSON validation errors
- Use the "Format JSON" button to fix common formatting issues
- Check for missing commas, brackets, or quotes

## Development

To modify the config editor:

1. Edit the files in `config-editor/`
2. Restart the Docker container: `make stop && make config-editor`
3. Changes will be reflected immediately

## License

This config editor is part of the Sell Your Ebook project.
