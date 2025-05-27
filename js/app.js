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

// Authentication functions
export async function signInWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function signUpWithEmail(email, password, userData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save additional user data
        await db.collection('users').doc(user.uid).set({
            ...userData,
            email,
            createdAt: new Date()
        });
        
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function signInWithGoogle(additionalData = {}) {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await auth.signInWithPopup(provider);
        const user = userCredential.user;
        
        // Check if user exists
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // Save user data for new users
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                ...additionalData,
                createdAt: new Date()
            });
        }
        
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        throw new Error(error.message);
    }
}

// Job posting functions
export async function saveJobPosting(jobData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const jobRef = await db.collection('jobs').add({
            ...jobData,
            recruiterId: user.uid,
            createdAt: new Date(),
            status: 'active'
        });

        return jobRef.id;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getJobPostings() {
    try {
        const snapshot = await db.collection('jobs')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

// Video CV functions
export async function saveVideoCV(videoFile) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Upload video to Firebase Storage
        const storageRef = storage.ref();
        const videoRef = storageRef.child(`videos/${user.uid}/${Date.now()}_${videoFile.name}`);
        await videoRef.put(videoFile);
        const videoURL = await videoRef.getDownloadURL();

        // Save video metadata to Firestore
        await db.collection('videoCVs').add({
            userId: user.uid,
            videoURL,
            createdAt: new Date()
        });

        return videoURL;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Case study functions
export async function submitCaseStudyResponse(jobId, responseData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await db.collection('applications').add({
            jobId,
            userId: user.uid,
            ...responseData,
            status: 'pending',
            createdAt: new Date()
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

// User profile functions
export async function getUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const userDoc = await db.collection('users').doc(user.uid).get();
        return userDoc.data();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function updateUserProfile(profileData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await db.collection('users').doc(user.uid).update({
            ...profileData,
            updatedAt: new Date()
        });
    } catch (error) {
        throw new Error(error.message);
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