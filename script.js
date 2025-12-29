// Portfolio Application
class PortfolioApp {
    constructor() {
        this.projects = [];
        // Password hash (SHA-256 of "portfolio2024") - Change this to your own password
        // To generate: use online SHA-256 hash generator with your password
        this.passwordHash = 'e191cdbf5bb9d55705f93723ddb61646823e72c051db47ead5dbf7446b1d0297';  // Default: "portfolio2024"
        this.loadProjects();
        this.initAuth();
        this.initEventListeners();
        this.renderProjects();
    }

    initAuth() {
        const authContainer = document.getElementById('auth-container');
        const uploadContainer = document.getElementById('upload-container');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');

        // Check if user is authenticated
        if (this.isAuthenticated()) {
            authContainer.style.display = 'none';
            uploadContainer.style.display = 'block';
        } else {
            authContainer.style.display = 'block';
            uploadContainer.style.display = 'none';
        }

        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = document.getElementById('admin-password').value;
                await this.handleLogin(password);
            });
        }

        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    async handleLogin(password) {
        const hash = await this.hashPassword(password);
        
        if (hash === this.passwordHash) {
            sessionStorage.setItem('portfolio_auth', 'true');
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('upload-container').style.display = 'block';
            document.getElementById('admin-password').value = '';
            this.showMessage('Successfully logged in!', 'success');
        } else {
            this.showMessage('Incorrect password. Please try again.', 'error');
            document.getElementById('admin-password').value = '';
        }
    }

    handleLogout() {
        sessionStorage.removeItem('portfolio_auth');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('upload-container').style.display = 'none';
        this.showMessage('Logged out successfully.', 'success');
    }

    isAuthenticated() {
        return sessionStorage.getItem('portfolio_auth') === 'true';
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    initEventListeners() {
        // Form submission
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Get form values
        const title = formData.get('title');
        const description = formData.get('description');
        const category = formData.get('category');
        const links = formData.get('links');
        
        // Get files
        const images = formData.getAll('images');
        const videos = formData.getAll('videos');
        const reports = formData.getAll('reports');
        
        // Process files
        const imageFiles = await this.processFiles(images);
        const videoFiles = await this.processFiles(videos);
        const reportFiles = await this.processFiles(reports);
        
        // Create project object
        const project = {
            id: Date.now(),
            title,
            description,
            category,
            links,
            images: imageFiles,
            videos: videoFiles,
            reports: reportFiles,
            createdAt: new Date().toISOString()
        };
        
        // Add to projects array
        this.projects.unshift(project);
        
        // Save to localStorage
        this.saveProjects();
        
        // Render projects
        this.renderProjects();
        
        // Reset form
        form.reset();
        
        // Show success message
        this.showMessage('Project added successfully!', 'success');
        
        // Scroll to projects section
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }

    async processFiles(files) {
        const processedFiles = [];
        
        for (const file of files) {
            if (file && file.size > 0) {
                try {
                    const dataUrl = await this.readFileAsDataURL(file);
                    processedFiles.push({
                        name: file.name,
                        type: file.type,
                        dataUrl: dataUrl,
                        size: file.size
                    });
                } catch (error) {
                    console.error('Error processing file:', error);
                }
            }
        }
        
        return processedFiles;
    }

    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    saveProjects() {
        try {
            localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
        } catch (error) {
            console.error('Error saving projects:', error);
            if (error.name === 'QuotaExceededError') {
                this.showMessage('Storage limit exceeded. Please use smaller files or delete old projects.', 'error');
            }
        }
    }

    loadProjects() {
        try {
            const stored = localStorage.getItem('portfolio_projects');
            if (stored) {
                this.projects = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    renderProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return;
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <p>No projects yet. Add your first project using the form below!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
        
        // Add delete event listeners (only if authenticated)
        if (this.isAuthenticated()) {
            container.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const projectId = parseInt(e.target.dataset.projectId);
                    this.deleteProject(projectId);
                });
            });
        }

        // Add media click listeners for modal view
        container.querySelectorAll('.media-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                this.openMediaModal(e.target.src, e.target.dataset.mediaType);
            });
        });
    }

    createProjectCard(project) {
        const categoryNames = {
            'web': 'Web Development',
            'mobile': 'Mobile App',
            'data': 'Data Science',
            'ai': 'AI/ML',
            'hardware': 'Hardware/IoT',
            'other': 'Other'
        };
        
        // Get first image as thumbnail or use placeholder
        const thumbnail = project.images.length > 0 
            ? project.images[0].dataUrl 
            : this.getPlaceholderImage();

        return `
            <div class="project-card">
                <img src="${thumbnail}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <span class="project-category">${categoryNames[project.category] || project.category}</span>
                    <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                    
                    <div class="project-media">
                        ${project.images.length > 0 ? `<span class="media-badge">📸 ${project.images.length} image(s)</span>` : ''}
                        ${project.videos.length > 0 ? `<span class="media-badge">🎥 ${project.videos.length} video(s)</span>` : ''}
                        ${project.reports.length > 0 ? `<span class="media-badge">📄 ${project.reports.length} document(s)</span>` : ''}
                    </div>

                    ${this.renderMediaGallery(project)}
                    
                    ${project.links ? `
                        <div class="project-links">
                            <a href="${this.escapeHtml(project.links)}" target="_blank" rel="noopener noreferrer">🔗 View Project</a>
                        </div>
                    ` : ''}
                    
                    ${this.isAuthenticated() ? `<button class="btn-delete" data-project-id="${project.id}">Delete Project</button>` : ''}
                </div>
            </div>
        `;
    }

    renderMediaGallery(project) {
        const allMedia = [
            ...project.images.map(img => ({ ...img, mediaType: 'image' })),
            ...project.videos.map(vid => ({ ...vid, mediaType: 'video' }))
        ];

        if (allMedia.length === 0) return '';

        const thumbnails = allMedia.slice(0, 4).map(media => {
            if (media.mediaType === 'image') {
                return `<img src="${media.dataUrl}" alt="${media.name}" class="media-thumbnail" data-media-type="image">`;
            } else {
                return `<video src="${media.dataUrl}" class="media-thumbnail" data-media-type="video"></video>`;
            }
        }).join('');

        return `<div class="media-gallery">${thumbnails}</div>`;
    }

    openMediaModal(src, mediaType) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <span class="modal-close">&times;</span>
                <div class="modal-content"></div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.classList.remove('active');
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        const content = modal.querySelector('.modal-content');
        if (mediaType === 'image') {
            content.innerHTML = `<img src="${src}" alt="Full size">`;
        } else {
            content.innerHTML = `<video src="${src}" controls autoplay></video>`;
        }

        modal.classList.add('active');
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveProjects();
            this.renderProjects();
            this.showMessage('Project deleted successfully!', 'success');
        }
    }

    getPlaceholderImage() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    showMessage(text, type) {
        const form = document.getElementById('project-form') || document.getElementById('login-form');
        if (!form) return;

        const existing = form.parentElement.querySelector('.message');
        if (existing) {
            existing.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        form.parentElement.insertBefore(message, form);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
