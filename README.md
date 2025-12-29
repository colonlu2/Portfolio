# Portfolio - Project Showcase Website

A professional portfolio website for showcasing projects with support for uploading and displaying project reports, videos, and pictures for recruiters and collaborators.

## Features

- **Project Upload Form**: Add new projects with titles, descriptions, and categories
- **Multi-Media Support**: 
  - Upload and display project images/screenshots
  - Upload and display demonstration videos
  - Upload project reports and documentation (PDF, DOC, DOCX, TXT)
- **Project Gallery**: Beautiful grid layout showcasing all projects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: Projects are saved in browser's local storage for persistence
- **Interactive Media Gallery**: Click on images and videos to view in full-screen modal
- **Project Management**: Delete projects as needed

## Usage

### Adding a Project

1. Navigate to the "Add Project" section
2. Fill in the project details:
   - **Project Title**: Name of your project
   - **Description**: Detailed description of what the project does
   - **Category**: Select the appropriate category (Web Development, Mobile App, Data Science, AI/ML, Hardware/IoT, Other)
3. Upload your media files:
   - **Images**: Screenshots, diagrams, or photos
   - **Videos**: Demonstration videos or presentations
   - **Reports**: Project documentation, reports, or related documents
4. Add project links (optional): GitHub repository, live demo, etc.
5. Click "Add Project" to save

### Viewing Projects

- All projects are displayed in the "My Projects" section
- Click on any thumbnail image or video to view it in full-screen
- Access project links directly from the project card
- See media counts (images, videos, documents) at a glance

### Managing Projects

- Each project card has a "Delete Project" button
- Click to remove projects you no longer want to display

## How to Deploy

### GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select the branch to deploy (e.g., `main` or `copilot/add-portfolio-upload-features`)
4. Select "/" (root) as the folder
5. Click "Save"
6. Your portfolio will be available at `https://yourusername.github.io/Portfolio/`

### Local Development

Simply open `index.html` in your web browser to view and test the portfolio locally.

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: Browser LocalStorage for data persistence
- **File Handling**: FileReader API for processing uploaded files
- **No Backend Required**: Fully client-side application

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: LocalStorage has size limitations (typically 5-10MB). For large files or many projects, consider using a backend storage solution.

## Customization

You can customize the portfolio by editing:
- `styles.css`: Change colors, fonts, and layout
- `index.html`: Modify structure and content
- `script.js`: Add new features or modify behavior

## License

Free to use and modify for personal and commercial projects. 
