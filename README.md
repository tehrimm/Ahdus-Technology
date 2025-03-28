```markdown
# 🚀 AI-Powered Job Portal (React & Tailwind CSS)

An AI-driven recruitment system built with **React** and **Tailwind CSS**. This platform provides a **seamless hiring experience** for both **employees and companies**, integrating AI-powered features to enhance **job searching, candidate matching, and recruitment processes**.

## 📌 Features

### 👨‍💼 **Employee Dashboard**
- **Profile Page** → Upload photo & manage details.
- **Job Listings** → View jobs posted by companies.
- **Apply for Jobs** → Submit applications with:
  - Profile Photo
  - Name, Email, Phone
  - German Language Proficiency
  - Visa Requirement
  - LinkedIn Profile URL
  - Upload Resume
- **AI Features:**
  - **Resume Enhancement** → AI enhances & formats resumes.
  - **Job Matchmaking** → AI suggests best job matches with scores.

### 🏢 **Company Dashboard**
- **Dashboard** → Interactive **Bar Graphs & Pie Charts**.
- **Manage Employees** → View all employees.
- **Departments** → Organize workforce.
- **Attendance & Payroll** → Track attendance & salaries.
- **Recruitment System** (Fully Functional)
  - **Post Jobs** → Create job listings.
  - **View Applicants** → See applications from employees.
  - **AI Candidate Search** → AI suggests the best candidates based on job requirements.

---

## 🔄 **How Data Flows Between Employee & Company Portals?**

### **1️⃣ How Jobs Posted by Companies Are Displayed in the Employee Portal?**
✅ **Step 1:** Companies post job listings in the **Recruitment → Jobs** section.  
✅ **Step 2:** These jobs are **stored in a shared database** (JSON or API).  
✅ **Step 3:** The Employee Portal fetches job listings from this shared data and displays them in the **Job Listings** section.  
✅ **Step 4:** Employees can **view details & apply** for any job with a single click.

### **2️⃣ How Employee Applications Are Displayed in the Company Portal?**
✅ **Step 1:** Employees apply for jobs using the **Apply Form** in the Employee Portal.  
✅ **Step 2:** The application data is **sent to the Company Portal** and stored in a common JSON structure (or API).  
✅ **Step 3:** In the **Company Dashboard → Candidates Section**, recruiters can see all **submitted applications**, including:
   - Profile Photo
   - Contact Details
   - Resume
   - Skills & Visa Requirements  
✅ **Step 4:** AI Candidate Search helps recruiters **filter & rank candidates** using **TF-IDF & KNN (TypeScript & TensorFlow.js)**.

---

## 🧠 **AI-Powered Features & How to Use Them?**

| AI Feature            | Where to Use                             | Model Used                  | How to Use?                                                                                                                                               |
|-----------------------|------------------------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Resume Enhancement** | Employee Portal → Application Form      | **Python (NLP & Text Processing)**  | While filling out the application form, upload your resume and toggle **"AI Assistance for Formatting"**. The AI will enhance & format the resume automatically. |
| **Job Matchmaking**    | Employee Portal → Job Listings          | **Python (TF-IDF & KNN)**   | AI suggests best job matches with a **score**. Employees can see their **match percentage** while browsing jobs.                                           |
| **AI Candidate Search**| Company Portal → Candidates Page        | **TF-IDF (TypeScript)**     | In the Candidates Page, use **Job Filters** to select a job. Click **"AI Match"** and then **"Analyze Candidates"**. AI will suggest the best candidates for the selected job with a **match score**. |

---

## 🛠️ **Tech Stack**
- **Frontend:** React, Tailwind CSS  
- **AI:** Python (TF-IDF, KNN, NLP), TensorFlow.js (Candidate Search)  
- **Routing:** React Router  
- **Deployment:** GitHub Pages / Vercel  

## 🔧 **Installation & Setup**

### **1. Clone the Repository:**
```bash
git clone https://github.com/your-username/your-repo-name.git
```

### **2. Install Dependencies:**
Navigate to the project folder and install the necessary dependencies using npm or yarn:

```bash
cd your-repo-name
npm install
```
or if you use yarn:
```bash
cd your-repo-name
yarn install
```

### **3. Run the Development Server:**
After installing the dependencies, run the development server to view the project locally:

```bash
npm run dev
```
or with yarn:
```bash
yarn run dev
```

This will start the project at `http://localhost:5000` where you can preview the job portal and test all features.

---

## ⚙️ **Assumptions and Design Decisions**

### **Assumptions:**
- **Centralized Job Listings:** Job listings are stored in a shared database accessible by both employees and companies.
- **Profile Data for AI Matchmaking:** The AI system relies on standardized profile data (skills, resume) for accurate matchmaking.
- **Real-Time Processing:** Job matches and applications are processed in real time, providing an instant response to users.

### **Design Decisions:**
- **Matchmaking in Job Listings:** Match percentages are displayed next to jobs, helping employees find the best fits.
- **Asynchronous AI Processing:** AI runs in the background to avoid delays in the user experience while processing resumes and job matches.
- **Job Filters & Candidate Search:** Companies can filter and rank candidates using AI to find the best fit for a job. 
