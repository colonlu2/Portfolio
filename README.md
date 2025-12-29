# Portfolio - Project Showcase Website

A professional portfolio website for showcasing projects with support for uploading and displaying project reports, videos, and pictures for recruiters and collaborators.

## Two-Site Architecture

This portfolio uses a **two-site approach** for better security and user experience:

1. **Public Site (`index.html`)** - Read-only portfolio for visitors
   - Clean, professional view without any editing controls
   - No login forms or password prompts
   - Visitors can browse all projects and media
   - This is the page you share publicly

2. **Editor Site (`editor.html`)** - Password-protected management interface
   - Full editing capabilities with authentication
   - Add, delete, and manage projects
   - Keep this page private (don't share the link)
   - Access it directly when you need to update your portfolio

Both sites share the same project data through browser localStorage, so changes made in the editor automatically appear on the public site.

## Features

- **Dual Interface**: Separate public and editor views
- **Password Protected Editing**: Only authorized users can access the editor
- **Project Upload Form**: Add new projects with titles, descriptions, and categories
- **Multi-Media Support**: 
  - Upload and display project images/screenshots
  - Upload and display demonstration videos
  - Upload project reports and documentation (PDF, DOC, DOCX, TXT)
- **Project Gallery**: Beautiful grid layout showcasing all projects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Projects are saved in browser's local storage for persistence
- **Interactive Media Gallery**: Click on images and videos to view in full-screen modal
- **Project Management**: Delete projects as needed (editor only)

## Getting Started

### For Visitors (Public View)
Simply open `index.html` or visit your deployed portfolio URL. You'll see all published projects without any editing interface.

### For Portfolio Owner (Editor)
1. Open `editor.html` in your browser
2. Enter the password when prompted (default: `portfolio2024`)
3. Add, edit, or delete projects
4. Changes automatically sync to the public view via localStorage

## Security

The editor is password protected to prevent unauthorized users from adding or deleting projects. 

**⚠️ IMPORTANT SECURITY NOTES:**
- This is a **client-side only** authentication mechanism suitable for personal portfolios
- The password hash is visible in the source code (script.js)
- Tech-savvy users could bypass this protection using browser developer tools
- For sensitive data or professional use, consider implementing server-side authentication
- This protection is designed to prevent casual unauthorized edits, not to secure critical data
- **Best practice**: Keep `editor.html` private and only share `index.html` publicly

### Default Password

The default password is: `portfolio2024`

**⚠️ IMPORTANT: Change this password before deploying your portfolio!**

### Changing the Password

1. Choose a strong password
2. Generate a SHA-256 hash of your password. **DO NOT use online tools** as they may log your password. Instead:
   - Use your browser console: `crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword')).then(h => console.log([...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('')))`
   - Or use command line: `echo -n "yourpassword" | sha256sum`
3. Open `script.js` and find this line (around line 10):
   ```javascript
   this.passwordHash = 'e191cdbf5bb9d55705f93723ddb61646823e72c051db47ead5dbf7446b1d0297';
   ```
4. Replace the hash with your new password hash
5. Save the file and deploy

## Usage

### Adding a Project (Editor Only)

1. Open `editor.html` in your browser

2. Enter the password when prompted
3. Fill in the project details:
   - **Project Title**: Name of your project
   - **Description**: Detailed description of what the project does
   - **Category**: Select the appropriate category (Web Development, Mobile App, Data Science, AI/ML, Hardware/IoT, Other)
4. Upload your media files:
   - **Images**: Screenshots, diagrams, or photos
   - **Videos**: Demonstration videos or presentations
   - **Reports**: Project documentation, reports, or related documents
5. Add project links (optional): GitHub repository, live demo, etc.
6. Click "Add Project" to save
7. Your new project will appear immediately on both editor and public views

### Viewing Projects (Public View)

- Open `index.html` to see the public portfolio
- All projects are displayed in the "My Projects" section
- Click on any thumbnail image or video to view it in full-screen
- Access project links directly from the project card
- See media counts (images, videos, documents) at a glance
- No editing controls or login forms visible to visitors

### Managing Projects (Editor Only)

- Each project card in `editor.html` has a "Delete Project" button when authenticated
- Click to remove projects you no longer want to display
- Changes sync automatically to the public view

## How to Deploy

### GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select the branch to deploy (e.g., `main`)
4. Select "/" (root) as the folder
5. Click "Save"
6. Your **public portfolio** will be available at `https://yourusername.github.io/Portfolio/`
7. Your **editor** will be at `https://yourusername.github.io/Portfolio/editor.html`
   - **Important**: Don't publicly link to editor.html - bookmark it privately

### Local Development

- Open `index.html` in your web browser to view the public portfolio
- Open `editor.html` to manage projects (requires password)

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: Browser LocalStorage for data persistence (shared between both sites)
- **File Handling**: FileReader API for processing uploaded files
- **No Backend Required**: Fully client-side application
- **Architecture**: Two separate HTML files sharing the same data layer

### Files Structure

- `index.html` - Public read-only portfolio (uses `public.js`)
- `editor.html` - Password-protected editor (uses `script.js`)
- `public.js` - Lightweight script for public view (no auth logic)
- `script.js` - Full application with authentication for editor
- `styles.css` - Shared styles for both sites

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: LocalStorage has size limitations (typically 5-10MB). For large files or many projects, consider using a backend storage solution.

## Customization

You can customize the portfolio by editing:
- `styles.css`: Change colors, fonts, and layout (affects both sites)
- `index.html`: Modify public view structure and content
- `editor.html`: Modify editor interface
- `public.js`: Customize public view behavior
- `script.js`: Add new features or modify editor behavior

## License

Free to use and modify for personal and commercial projects. 
