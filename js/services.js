import { auth, db, storage } from './firebase-config.js';
import { User, JobPost, Application } from './models.js';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Auth Services
const AuthService = {
    async signUp(email, password, userData) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = new User({
                ...userData,
                uid: userCredential.user.uid
            });
            await db.collection('users').doc(user.uid).set(user.toJSON());
            return user;
        } catch (error) {
            throw error;
        }
    },

    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
            return new User(userDoc.data());
        } catch (error) {
            throw error;
        }
    },

    async signOut() {
        try {
            await auth.signOut();
        } catch (error) {
            throw error;
        }
    }
};

// Job Services
class JobService {
    static async createJob(jobData) {
        try {
            const jobsRef = collection(db, 'jobs');
            const docRef = await addDoc(jobsRef, {
                ...jobData,
                createdAt: new Date(),
                status: 'active',
                applications: []
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }

    static async getActiveJobs() {
        try {
            const jobsRef = collection(db, 'jobs');
            const q = query(jobsRef, where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching active jobs:', error);
            throw error;
        }
    }

    static async getJobById(jobId) {
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobRef);
            
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            
            return {
                id: jobDoc.id,
                ...jobDoc.data()
            };
        } catch (error) {
            console.error('Error fetching job:', error);
            throw error;
        }
    }

    static async submitApplication(jobId, applicationData) {
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobRef);
            
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            
            // Upload resume
            const resumeRef = ref(storage, `applications/${jobId}/resumes/${applicationData.userId}_${Date.now()}.pdf`);
            await uploadBytes(resumeRef, applicationData.resume);
            const resumeUrl = await getDownloadURL(resumeRef);
            
            // Upload video if provided
            let videoUrl = null;
            if (applicationData.videoIntro) {
                const videoRef = ref(storage, `applications/${jobId}/videos/${applicationData.userId}_${Date.now()}.mp4`);
                await uploadBytes(videoRef, applicationData.videoIntro);
                videoUrl = await getDownloadURL(videoRef);
            }
            
            // Update job document with new application
            const applications = jobDoc.data().applications || [];
            applications.push({
                userId: applicationData.userId,
                coverLetter: applicationData.coverLetter,
                resumeUrl,
                videoUrl,
                submittedAt: new Date(),
                status: 'pending'
            });
            
            await updateDoc(jobRef, { applications });
            
            return {
                success: true,
                applicationId: applications.length - 1
            };
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    }

    static async getApplicationsForJob(jobId) {
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobRef);
            
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            
            return jobDoc.data().applications || [];
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    static async updateApplicationStatus(jobId, applicationIndex, status) {
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobRef);
            
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            
            const applications = jobDoc.data().applications;
            if (!applications || !applications[applicationIndex]) {
                throw new Error('Application not found');
            }
            
            applications[applicationIndex].status = status;
            await updateDoc(jobRef, { applications });
            
            return true;
        } catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    }

    static async updateApplicationRating(jobId, userId, rating) {
        try {
            const jobRef = doc(db, 'jobs', jobId);
            const jobDoc = await getDoc(jobRef);
            
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            
            const applications = jobDoc.data().applications;
            const applicationIndex = applications.findIndex(app => app.userId === userId);
            
            if (applicationIndex === -1) {
                throw new Error('Application not found');
            }
            
            applications[applicationIndex].rating = rating;
            await updateDoc(jobRef, { applications });
            
            return true;
        } catch (error) {
            console.error('Error updating application rating:', error);
            throw error;
        }
    }

    static async generateInterviewLink(jobId, userId) {
        try {
            // Generate a unique meeting ID
            const meetingId = `${jobId}_${userId}_${Date.now()}`;
            
            // Create a Google Meet link (for now, we'll use a placeholder)
            const meetLink = `https://meet.google.com/${meetingId}`;
            
            // Store the meeting link in Firestore
            const meetingRef = doc(db, 'interviews', meetingId);
            await setDoc(meetingRef, {
                jobId,
                userId,
                meetLink,
                scheduledAt: new Date(),
                status: 'scheduled'
            });
            
            return meetLink;
        } catch (error) {
            console.error('Error generating interview link:', error);
            throw error;
        }
    }

    static async sendInterviewInvite(userId, meetLink) {
        try {
            // Get user's email from Firestore
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) {
                throw new Error('User not found');
            }
            
            const userEmail = userDoc.data().email;
            
            // Here you would typically integrate with an email service
            // For now, we'll just log the email details
            console.log('Sending interview invite:', {
                to: userEmail,
                meetLink
            });
            
            return true;
        } catch (error) {
            console.error('Error sending interview invite:', error);
            throw error;
        }
    }

    static async getInterviews() {
        try {
            const interviewsRef = collection(db, 'interviews');
            const q = query(interviewsRef, where('status', '==', 'scheduled'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching interviews:', error);
            throw error;
        }
    }
}

// Application Services
const ApplicationService = {
    async createApplication(applicationData) {
        try {
            const applicationRef = db.collection('applications').doc();
            const application = new Application({
                ...applicationData,
                id: applicationRef.id
            });
            await applicationRef.set(application.toJSON());
            return application;
        } catch (error) {
            throw error;
        }
    },

    async getApplicationsByJob(jobId) {
        try {
            const snapshot = await db.collection('applications')
                .where('jobId', '==', jobId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => new Application(doc.data()));
        } catch (error) {
            throw error;
        }
    },

    async getApplicationsByUser(userId) {
        try {
            const snapshot = await db.collection('applications')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            return snapshot.docs.map(doc => new Application(doc.data()));
        } catch (error) {
            throw error;
        }
    }
};

// Storage Service for video uploads
const StorageService = {
    async uploadVideo(file, userId, jobId) {
        try {
            const storageRef = storage.ref();
            const videoRef = storageRef.child(`videos/${userId}/${jobId}/${file.name}`);
            await videoRef.put(file);
            return await videoRef.getDownloadURL();
        } catch (error) {
            throw error;
        }
    }
};

export { AuthService, JobService, ApplicationService, StorageService }; 