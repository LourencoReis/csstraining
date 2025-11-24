// Gallery Image Upload Functionality

// Trigger file input when gallery item is clicked
function triggerUpload(index) {
    document.getElementById(`fileInput${index}`).click();
}

// Handle image upload and display
function handleImageUpload(event, index) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const item = galleryItems[index];
            
            // Remove existing image if any
            const existingImg = item.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
            
            // Remove existing delete button if any
            const existingBtn = item.querySelector('.delete-btn');
            if (existingBtn) {
                existingBtn.remove();
            }
            
            // Create and add new image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `Memory ${index + 1}`;
            item.appendChild(img);
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function(e) {
                e.stopPropagation(); // Prevent triggering upload
                removeImage(index);
            };
            item.appendChild(deleteBtn);
            
            // Add class to indicate image is present
            item.classList.add('has-image');
            
            // Save to localStorage so images persist on page reload
            localStorage.setItem(`gallery-image-${index}`, e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
}

// Remove image function
function removeImage(index) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const item = galleryItems[index];
    
    // Remove image
    const img = item.querySelector('img');
    if (img) {
        img.remove();
    }
    
    // Remove delete button
    const deleteBtn = item.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.remove();
    }
    
    // Remove class
    item.classList.remove('has-image');
    
    // Remove from localStorage
    localStorage.removeItem(`gallery-image-${index}`);
}

// Add new gallery slot
function addNewSlot() {
    const gallery = document.querySelector('.gallery-grid');
    const currentSlots = document.querySelectorAll('.gallery-item').length;
    const newIndex = currentSlots;
    
    // Create new gallery item
    const newItem = document.createElement('div');
    newItem.className = 'gallery-item upload-item';
    newItem.onclick = function() { triggerUpload(newIndex); };
    
    const p = document.createElement('p');
    p.textContent = 'Click to add photo';
    newItem.appendChild(p);
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = `fileInput${newIndex}`;
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = function(e) { handleImageUpload(e, newIndex); };
    
    // Add to DOM
    gallery.appendChild(newItem);
    document.querySelector('.content-section').appendChild(fileInput);
    
    // Save slot count
    localStorage.setItem('gallery-slot-count', currentSlots + 1);
}

// Load saved images from localStorage on page load
window.addEventListener('DOMContentLoaded', function() {
    // Load saved slot count or default to 6
    const savedSlotCount = parseInt(localStorage.getItem('gallery-slot-count')) || 6;
    const gallery = document.querySelector('.gallery-grid');
    const currentSlots = document.querySelectorAll('.gallery-item').length;
    
    // Add missing slots if needed
    for (let i = currentSlots; i < savedSlotCount; i++) {
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item upload-item';
        newItem.onclick = function() { triggerUpload(i); };
        
        const p = document.createElement('p');
        p.textContent = 'Click to add photo';
        newItem.appendChild(p);
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = `fileInput${i}`;
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.onchange = function(e) { handleImageUpload(e, i); };
        
        gallery.appendChild(newItem);
        document.querySelector('.content-section').appendChild(fileInput);
    }
    
    // Load saved images
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        const savedImage = localStorage.getItem(`gallery-image-${index}`);
        
        if (savedImage) {
            const img = document.createElement('img');
            img.src = savedImage;
            img.alt = `Memory ${index + 1}`;
            item.appendChild(img);
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                removeImage(index);
            };
            item.appendChild(deleteBtn);
            
            item.classList.add('has-image');
        }
    });
});
