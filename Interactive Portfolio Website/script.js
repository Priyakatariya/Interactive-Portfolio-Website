document.addEventListener('DOMContentLoaded', () => {
    // --- Select Elements from the DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitcher = document.querySelector('.theme-switcher');
    const sections = document.querySelectorAll('section[id]'); // All sections with an ID attribute
    const body = document.body; // Reference to the body for theme switching and no-scroll

    // Hero Images (for the carousel)
    const heroImages = document.querySelectorAll('.hero-images img');
    let currentImageIndex = 0;

    // Certificate Slider elements
    const certificateItems = document.querySelectorAll('.certificate-item');
    const prevCertBtn = document.getElementById('prevCert');
    const nextCertBtn = document.getElementById('nextCert');
    let currentCertIndex = 0;

    // Manual Update Modal elements
    const manualUpdateModal = document.getElementById('manual-update-modal');
    const closeButton = manualUpdateModal ? manualUpdateModal.querySelector('.close-button') : null;
    const updateStatsForm = document.getElementById('update-stats-form');
    const platformDisplayNameInput = document.getElementById('platform-display-name');
    const problemsSolvedInput = document.getElementById('problems-solved-input');
    const ratingInput = document.getElementById('rating-input');
    let currentEditingPlatformId = null; // To keep track of which platform we're editing

    // --- Mobile Navigation Toggle ---
    // Event listener for the hamburger icon click
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active'); // Toggles the visibility of navigation links
        hamburger.classList.toggle('toggle'); // Toggles the hamburger icon animation
        body.classList.toggle('no-scroll'); // Prevents background scroll when nav is open
    });

    // Close mobile navigation when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Only close if navigation is active (mobile view)
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                body.classList.remove('no-scroll');
            }
        });
    });

    // --- Dark Mode Toggle ---
    // Function to apply the saved theme preference
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>'; // Display moon icon for dark mode
        } else {
            body.classList.remove('dark-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>'; // Display sun icon for light mode
        }
    };

    // Event listener for theme switcher icon click
    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            // If currently dark, switch to light
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            // If currently light, switch to dark
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Apply saved theme on initial page load
    applySavedTheme();

    // --- Active Navigation Link Highlighting on Scroll ---
    const highlightNavOnScroll = () => {
        let currentSectionId = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            // Adjust offset to account for any fixed header height
            const sectionTop = section.offsetTop - 80;
            const sectionHeight = section.clientHeight;

            // Determine if the current scroll position is within the section
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Remove 'active' class from all links
        navLinks.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            // Add 'active' class to the link that matches the current section
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    };

    // Attach scroll event listener
    window.addEventListener('scroll', highlightNavOnScroll);
    // Call once on load to set the initial active link based on the starting scroll position
    highlightNavOnScroll();

    // --- Hero Image Carousel ---
    function showNextHeroImage() {
        if (heroImages.length === 0) return; // Exit if no hero images are found

        heroImages[currentImageIndex].classList.remove('active-image'); // Hide current image
        currentImageIndex = (currentImageIndex + 1) % heroImages.length; // Move to next image, loop back if at end
        heroImages[currentImageIndex].classList.add('active-image'); // Show new current image
    }

    if (heroImages.length > 0) {
        heroImages[0].classList.add('active-image'); // Ensure the first image is visible initially
        setInterval(showNextHeroImage, 5000); // Change image every 5 seconds
    }

    // --- Certificate Slider ---
    function showCertificate(index) {
        if (certificateItems.length === 0) return; // Exit if no certificate items

        certificateItems.forEach(item => {
            item.classList.remove('active-cert');
            item.style.opacity = 0;
            item.style.pointerEvents = 'none'; // Disable interaction for inactive items
        });

        certificateItems[index].classList.add('active-cert');
        certificateItems[index].style.opacity = 1;
        certificateItems[index].style.pointerEvents = 'auto'; // Enable interaction for active item
    }

    function nextCertificate() {
        currentCertIndex = (currentCertIndex + 1) % certificateItems.length;
        showCertificate(currentCertIndex);
    }

    function prevCertificate() {
        currentCertIndex = (currentCertIndex - 1 + certificateItems.length) % certificateItems.length;
        showCertificate(currentCertIndex);
    }

    if (certificateItems.length > 0) {
        showCertificate(currentCertIndex); // Show the first certificate initially
        // Attach event listeners to navigation buttons if they exist
        if (prevCertBtn) prevCertBtn.addEventListener('click', prevCertificate);
        if (nextCertBtn) nextCertBtn.addEventListener('click', nextCertificate);
    }

    // --- Skills Section: Highlight skill and display detail on click ---
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'highlighted-skill' from all previously highlighted items
            document.querySelectorAll('.highlighted-skill').forEach(highlighted => {
                highlighted.classList.remove('highlighted-skill');
            });
            // Hide all skill details to reset the view
            document.querySelectorAll('.skill-detail').forEach(detail => {
                detail.classList.remove('active');
                detail.style.display = 'none'; // Ensure it's hidden for layout
            });

            // Add 'highlighted-skill' to the clicked item
            item.classList.add('highlighted-skill');

            // Find the closest skill-category to get its associated skill-detail div
            const skillCategory = item.closest('.skill-category');
            const skillDetailDiv = skillCategory ? skillCategory.querySelector('.skill-detail') : null;

            if (skillDetailDiv) {
                // Get the detail text from the 'data-detail' attribute of the clicked skill
                const detailText = item.getAttribute('data-detail');
                skillDetailDiv.textContent = detailText; // Update the content of the detail div
                skillDetailDiv.style.display = 'block'; // Make the detail div visible
                // Use a small timeout to allow display change to register before triggering CSS transition
                setTimeout(() => {
                    skillDetailDiv.classList.add('active'); // Add 'active' for CSS transition (e.g., fade-in)
                }, 10);
            }
        });
    });

    // --- Manual Update Feature Logic ---

    // Function to load persisted stats from localStorage when the page loads
    function loadPersistedStats() {
        const platforms = ['leetcode', 'geeksforgeeks', 'codeforces', 'codestudio', 'hackerrank', 'codechef', 'codolio']; // List of all platform IDs

        platforms.forEach(platformId => {
            const problemsSolved = localStorage.getItem(`${platformId}_problemsSolved`);
            const rating = localStorage.getItem(`${platformId}_rating`); // Generic key for rating/rank

            const platformCard = document.getElementById(platformId);
            if (platformCard) {
                const problemsSolvedSpan = platformCard.querySelector('.problems-solved');
                // Select a broader range of elements that might display rating/rank/stats
                const ratingSpan = platformCard.querySelector('.contest-rating, .max-rating, .overall-rank, .overall-badges, .courses-completed, .contests-participated');

                // Update the display if data exists in localStorage
                if (problemsSolved && problemsSolvedSpan) {
                    problemsSolvedSpan.textContent = problemsSolved;
                }
                if (rating && ratingSpan) {
                    ratingSpan.textContent = rating;
                }
            }
        });
    }

    // Call loadPersistedStats immediately when the DOM is fully loaded
    loadPersistedStats();

    // Event listeners for opening the manual update modal
    document.querySelectorAll('.edit-stats-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const platformId = event.target.dataset.platform; // Get the platform ID from the data attribute
            currentEditingPlatformId = platformId; // Store which platform is being edited

            // Set the display name in the modal's input field
            if (platformDisplayNameInput) {
                let displayName = platformId.charAt(0).toUpperCase() + platformId.slice(1);
                if (platformId === 'geeksforgeeks') displayName = 'GeeksforGeeks';
                if (platformId === 'codestudio') displayName = 'CodeStudio';
                platformDisplayNameInput.value = displayName;
            }

            // Get the corresponding platform card on the page
            const platformCard = document.getElementById(platformId);

            // Load existing data from the displayed spans into the modal's form inputs
            if (platformCard) {
                const problemsSolvedSpan = platformCard.querySelector('.problems-solved');
                const ratingSpan = platformCard.querySelector('.contest-rating, .max-rating, .overall-rank, .overall-badges, .courses-completed, .contests-participated');

                if (problemsSolvedInput && problemsSolvedSpan) {
                    problemsSolvedInput.value = problemsSolvedSpan.textContent.trim();
                }
                if (ratingInput && ratingSpan) {
                    ratingInput.value = ratingSpan.textContent.trim();
                }
            }

            // Show the modal with a transition if it exists
            if (manualUpdateModal) {
                manualUpdateModal.classList.add('active');
            }
        });
    });

    // Event listener for closing the modal via the close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            manualUpdateModal.classList.remove('active'); // Hide the modal with transition
        });
    }

    // Event listener for closing the modal by clicking outside its content
    window.addEventListener('click', (event) => {
        if (manualUpdateModal && event.target === manualUpdateModal) {
            manualUpdateModal.classList.remove('active');
        }
    });

    // Handle form submission for updating stats
    if (updateStatsForm) {
        updateStatsForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission (page reload)

            if (currentEditingPlatformId) {
                const newProblemsSolved = problemsSolvedInput ? problemsSolvedInput.value.trim() : '';
                const newRating = ratingInput ? ratingInput.value.trim() : '';

                // Save the new data to localStorage
                localStorage.setItem(`${currentEditingPlatformId}_problemsSolved`, newProblemsSolved);
                localStorage.setItem(`${currentEditingPlatformId}_rating`, newRating);

                // Update the displayed stats directly on the page
                const platformCard = document.getElementById(currentEditingPlatformId);
                if (platformCard) {
                    const problemsSolvedSpan = platformCard.querySelector('.problems-solved');
                    const ratingSpan = platformCard.querySelector('.contest-rating, .max-rating, .overall-rank, .overall-badges, .courses-completed, .contests-participated');

                    if (problemsSolvedSpan) {
                        problemsSolvedSpan.textContent = newProblemsSolved;
                    }
                    if (ratingSpan) {
                        ratingSpan.textContent = newRating;
                    }
                }

                manualUpdateModal.classList.remove('active'); // Close the modal after submission
            }
        });
    }
});