/**
 * Blog JavaScript
 * Handles blog functionality, filtering, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFiltering();
    initializeBlogSearch();
});

function initializeBlogFiltering() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            blogPosts.forEach(post => {
                const postCategory = post.querySelector('.post-category').textContent.toLowerCase().replace(/\s+/g, '-');
                
                if (category === 'all' || postCategory.includes(category)) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeIn 0.5s ease';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

function initializeBlogSearch() {
    // Add search functionality if search box exists
    const searchBox = document.getElementById('blogSearch');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const blogPosts = document.querySelectorAll('.blog-post');
            
            blogPosts.forEach(post => {
                const title = post.querySelector('h2').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
}