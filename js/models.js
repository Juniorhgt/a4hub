// User Model
class User {
    constructor(data) {
        this.uid = data.uid;
        this.email = data.email;
        this.displayName = data.displayName;
        this.photoURL = data.photoURL;
        this.userType = data.userType; // 'recruiter' or 'jobseeker'
        this.createdAt = data.createdAt || new Date();
    }

    toJSON() {
        return {
            uid: this.uid,
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
            userType: this.userType,
            createdAt: this.createdAt
        };
    }
}

// Job Post Model
class JobPost {
    constructor(data) {
        this.id = data.id;
        this.companyInfo = {
            name: data.companyName,
            size: data.companySize,
            industry: data.companyIndustry,
            location: data.companyLocation
        };
        this.roleDetails = {
            title: data.jobTitle,
            experienceRange: {
                min: data.minExperience,
                max: data.maxExperience
            },
            description: data.jobDescription,
            skills: data.skills || []
        };
        this.businessCase = {
            problemStatement: data.problemStatement,
            context: data.contextDetails,
            caseStudy: data.caseStudy
        };
        this.createdBy = data.createdBy; // User ID
        this.createdAt = data.createdAt || new Date();
        this.status = data.status || 'active';
    }

    toJSON() {
        return {
            id: this.id,
            companyInfo: this.companyInfo,
            roleDetails: this.roleDetails,
            businessCase: this.businessCase,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            status: this.status
        };
    }
}

// Application Model
class Application {
    constructor(data) {
        this.id = data.id;
        this.jobId = data.jobId;
        this.userId = data.userId;
        this.status = data.status || 'pending'; // pending, reviewed, accepted, rejected
        this.videoIntroduction = data.videoIntroduction;
        this.caseStudyResponse = data.caseStudyResponse;
        this.createdAt = data.createdAt || new Date();
    }

    toJSON() {
        return {
            id: this.id,
            jobId: this.jobId,
            userId: this.userId,
            status: this.status,
            videoIntroduction: this.videoIntroduction,
            caseStudyResponse: this.caseStudyResponse,
            createdAt: this.createdAt
        };
    }
}

export { User, JobPost, Application }; 