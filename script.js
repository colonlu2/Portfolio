// Portfolio Application
class PortfolioApp {
    constructor() {
        this.projects = [];
        // Password hash (SHA-256 of "portfolio2024") - Change this to your own password
        // SECURITY NOTE: This is client-side authentication only - the hash is visible in source code.
        // This provides basic protection against casual unauthorized edits but is NOT secure against
        // determined users. For production use with sensitive data, implement server-side authentication.
        // To generate hash: See README.md for secure methods
        this.passwordHash = 'e5c4a0c13fd3b5b3da2790184649109839b508cd498883efbc60293a259e35b9';  // Default: "portfolio2024"
        this.loadProjects();
        this.initAuth();
        this.initEventListeners();
        this.renderProjects();
    }

    initAuth() {
        const authContainer = document.getElementById('auth-container');
        const uploadContainer = document.getElementById('upload-container');
        const passwordChangeContainer = document.getElementById('password-change-container');
        const passwordChangeAuthRequired = document.getElementById('password-change-auth-required');
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');
        const passwordChangeForm = document.getElementById('password-change-form');

        // Check if user is authenticated
        if (this.isAuthenticated()) {
            if (authContainer) authContainer.style.display = 'none';
            if (uploadContainer) uploadContainer.style.display = 'block';
            if (passwordChangeContainer) passwordChangeContainer.style.display = 'block';
            if (passwordChangeAuthRequired) passwordChangeAuthRequired.style.display = 'none';
        } else {
            if (authContainer) authContainer.style.display = 'block';
            if (uploadContainer) uploadContainer.style.display = 'none';
            if (passwordChangeContainer) passwordChangeContainer.style.display = 'none';
            if (passwordChangeAuthRequired) passwordChangeAuthRequired.style.display = 'block';
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

        // Password change form submission
        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handlePasswordChange(e);
            });
        }
    }

    async handleLogin(password) {
        const hash = await this.hashPassword(password);
        
        if (hash === this.passwordHash) {
            sessionStorage.setItem('portfolio_auth', 'true');
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('upload-container').style.display = 'block';
            const passwordChangeContainer = document.getElementById('password-change-container');
            const passwordChangeAuthRequired = document.getElementById('password-change-auth-required');
            if (passwordChangeContainer) passwordChangeContainer.style.display = 'block';
            if (passwordChangeAuthRequired) passwordChangeAuthRequired.style.display = 'none';
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
        const passwordChangeContainer = document.getElementById('password-change-container');
        const passwordChangeAuthRequired = document.getElementById('password-change-auth-required');
        if (passwordChangeContainer) passwordChangeContainer.style.display = 'none';
        if (passwordChangeAuthRequired) passwordChangeAuthRequired.style.display = 'block';
        this.showMessage('Logged out successfully.', 'success');
    }

    isAuthenticated() {
        // Note: sessionStorage can be manipulated via browser dev tools
        // This is acceptable for a client-side portfolio but not for sensitive applications
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

    async handlePasswordChange(e) {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate new password and confirmation match
        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match. Please try again.', 'error');
            return;
        }

        // Validate new password is not empty
        if (newPassword.length === 0) {
            this.showMessage('New password cannot be empty.', 'error');
            return;
        }

        // Verify current password
        const currentHash = await this.hashPassword(currentPassword);
        if (currentHash !== this.passwordHash) {
            this.showMessage('Current password is incorrect.', 'error');
            document.getElementById('current-password').value = '';
            return;
        }

        // Generate new password hash
        const newHash = await this.hashPassword(newPassword);

        // Update password hash
        this.passwordHash = newHash;

        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';

        // Show success message (without exposing hash in UI for security)
        this.showMessage('Password changed successfully! Check the browser console for your new password hash and instructions to make it permanent.', 'success');
        
        // Log the hash to console for copying
        // Note: Clear your browser console after copying the hash for security
        console.log(`${'='.repeat(80)}
PASSWORD CHANGE SUCCESSFUL
${'='.repeat(80)}
Your new password hash is:
${newHash}

To make this change permanent:
1. Open script.js in your editor
2. Find the line: this.passwordHash = '...'
3. Replace the hash value with: '${newHash}'
4. Save the file and redeploy

SECURITY NOTE: Clear your browser console after copying the hash.
${'='.repeat(80)}`);
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
        const form = document.getElementById('project-form') || document.getElementById('login-form') || document.getElementById('password-change-form');
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
