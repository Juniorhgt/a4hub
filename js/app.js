import { auth, db, storage } from './firebase-config.js';

// Dummy data for case studies
const dummyCaseStudies = {
    'frontend': {
        title: 'Build a Modern Todo App',
        description: 'Create a responsive todo application using React. Include features like drag-and-drop, filtering, and local storage.',
        requirements: ['React', 'CSS', 'JavaScript', 'Local Storage API'],
        timeLimit: '2 hours'
    },
    'backend': {
        title: 'Design a REST API',
        description: 'Design and implement a RESTful API for a blog system. Include user authentication, CRUD operations, and data validation.',
        requirements: ['Node.js', 'Express', 'MongoDB', 'JWT'],
        timeLimit: '3 hours'
    },
    'marketing': {
        title: 'Social Media Campaign',
        description: 'Create a social media campaign strategy for a new product launch. Include content calendar, target audience analysis, and KPIs.',
        requirements: ['Social Media', 'Analytics', 'Content Strategy'],
        timeLimit: '4 hours'
    }
};

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.uid);
        updateUIForUser(user);
    } else {
        // User is signed out
        console.log('User is signed out');
        updateUIForGuest();
    }
});

// Function to generate case study using dummy data
async function generateCaseStudy(jobDetails) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get case study based on job title
    const jobType = jobDetails.title.toLowerCase().includes('frontend') ? 'frontend' :
                   jobDetails.title.toLowerCase().includes('backend') ? 'backend' : 'marketing';
    
    return dummyCaseStudies[jobType];
}

// Function to save job posting
async function saveJobPosting(jobData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Generate a dummy case study
        const caseStudy = await generateCaseStudy(jobData);

        // Save to Firestore
        const jobRef = await db.collection('jobs').add({
            ...jobData,
            caseStudy,
            createdBy: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'active',
            applicants: []
        });

        return jobRef.id;
    } catch (error) {
        console.error('Error saving job posting:', error);
        throw error;
    }
}

// Function to save video CV
async function saveVideoCV(videoFile) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a dummy URL
        const dummyURL = `https://storage.googleapis.com/a4hub-videos/${user.uid}/${Date.now()}_${videoFile.name}`;

        // Save to Firestore
        await db.collection('users').doc(user.uid).update({
            videoCV: dummyURL,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return dummyURL;
    } catch (error) {
        console.error('Error saving video CV:', error);
        throw error;
    }
}

// Function to submit case study response
async function submitCaseStudyResponse(jobId, response) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to Firestore
        await db.collection('applications').add({
            jobId,
            userId: user.uid,
            response,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'submitted',
            feedback: null
        });
    } catch (error) {
        console.error('Error submitting case study response:', error);
        throw error;
    }
}

// UI update functions
function updateUIForUser(user) {
    // Show user-specific content
    document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.auth-not-required').forEach(el => el.style.display = 'none');
}

function updateUIForGuest() {
    // Show guest content
    document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.auth-not-required').forEach(el => el.style.display = 'block');
}

// Export functions for use in other modules
export {
    generateCaseStudy,
    saveJobPosting,
    saveVideoCV,
    submitCaseStudyResponse
}; 