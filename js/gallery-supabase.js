// Gallery with Supabase Integration

let galleryImages = [];

// Trigger file input when gallery item is clicked
function triggerUpload(index) {
    const fileInput = document.getElementById(`fileInput${index}`);
    if (fileInput) {
        fileInput.click();
    }
}

// Handle image upload to Supabase
async function handleImageUpload(event, index) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const item = galleryItems[index];
        
        // Show uploading message
        item.innerHTML = '<p style="color: #667eea;">Uploading...</p>';
        
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `${timestamp}_${index}.${fileExt}`;
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (error) throw error;
            
            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            
            const imageUrl = publicUrlData.publicUrl;
            
            // Update gallery images array
            galleryImages[index] = {
                url: imageUrl,
                fileName: fileName
            };
            
            // Display the uploaded image
            displayImage(item, imageUrl, fileName, index);
            
            // Reset file input
            event.target.value = '';
            
        } catch (error) {
            console.error('Upload error:', error);
            item.innerHTML = '<p style="color: #ff3b30;">Upload failed. Try again.</p>';
            setTimeout(() => {
                item.innerHTML = '<p>Click to add photo</p>';
            }, 2000);
        }
    }
}

// Display image in gallery item
function displayImage(item, imageUrl, fileName, index) {
    item.innerHTML = '';
    item.classList.add('has-image');
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Memory ${index + 1}`;
    item.appendChild(img);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        removeImage(index, fileName);
    };
    item.appendChild(deleteBtn);
}

// Remove image from Supabase
async function removeImage(index, fileName) {
    if (!confirm('Delete this photo?')) return;
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    const item = galleryItems[index];
    
    try {
        // Delete from Supabase Storage
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([fileName]);
        
        if (error) throw error;
        
        // Update local array
        galleryImages[index] = null;
        
        // Reset gallery item
        item.innerHTML = '<p>Click to add photo</p>';
        item.classList.remove('has-image');
        
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete photo. Please try again.');
    }
}

// Add new gallery slot
function addNewSlot() {
    const gallery = document.getElementById('galleryGrid');
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
    
    // Add to page
    gallery.appendChild(newItem);
    document.getElementById('fileInputsContainer').appendChild(fileInput);
    
    // Expand galleryImages array
    galleryImages.push(null);
}

// Load all images from Supabase on page load
async function loadGalleryImages() {
    try {
        // List all files in the bucket
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            });
        
        if (error) throw error;
        
        const gallery = document.getElementById('galleryGrid');
        const fileInputsContainer = document.getElementById('fileInputsContainer');
        
        // Determine how many slots we need (at least 6, or number of images)
        const numSlots = Math.max(6, data.length);
        
        // Create gallery slots
        for (let i = 0; i < numSlots; i++) {
            // Create gallery item
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item upload-item';
            newItem.onclick = function() { triggerUpload(i); };
            
            const p = document.createElement('p');
            p.textContent = 'Click to add photo';
            newItem.appendChild(p);
            
            gallery.appendChild(newItem);
            
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = `fileInput${i}`;
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.onchange = function(e) { handleImageUpload(e, i); };
            
            fileInputsContainer.appendChild(fileInput);
            
            // Initialize galleryImages array
            galleryImages.push(null);
        }
        
        // Load existing images
        const galleryItems = document.querySelectorAll('.gallery-item');
        data.forEach((file, fileIndex) => {
            if (file.name && fileIndex < galleryItems.length) {
                // Extract index from filename (format: timestamp_index.ext)
                const match = file.name.match(/_(\d+)\./);
                const index = match ? parseInt(match[1]) : fileIndex;
                
                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(file.name);
                
                const imageUrl = publicUrlData.publicUrl;
                
                // Store in array
                galleryImages[index] = {
                    url: imageUrl,
                    fileName: file.name
                };
                
                // Display image
                if (galleryItems[index]) {
                    displayImage(galleryItems[index], imageUrl, file.name, index);
                }
            }
        });
        
        // Hide loading, show gallery
        document.getElementById('loading').style.display = 'none';
        gallery.style.display = 'grid';
        
    } catch (error) {
        console.error('Load error:', error);
        document.getElementById('loading').innerHTML = '<p style="color: #ff3b30;">Failed to load gallery. Please refresh.</p>';
    }
}

// Initialize gallery on page load
window.addEventListener('DOMContentLoaded', loadGalleryImages);
