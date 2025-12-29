// Portfolio Application - Public Read-Only Version
class PortfolioPublic {
    constructor() {
        this.projects = [];
        this.loadProjects();
        this.initEventListeners();
        this.renderProjects();
    }

    initEventListeners() {
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
                    <p>No projects available yet. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
        
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

    getPlaceholderImage() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioPublic();
});
