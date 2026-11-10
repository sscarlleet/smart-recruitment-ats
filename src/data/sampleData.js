// sampleData.js
// All fake data used across the app.
// Replace these with real API calls later.

// ── DEMO USERS ──────────────────────────────────────────
export const DEMO_USERS = [
  { id: 1, name: 'Admin User',   email: 'admin@smartats.com',  password: 'admin123',  role: 'admin'     },
  { id: 2, name: 'Sara HR',      email: 'hr@smartats.com',     password: 'hr123',     role: 'hr'        },
  { id: 3, name: 'John Doe',     email: 'john@example.com',    password: 'cand123',   role: 'candidate' },
];

// ── JOBS ────────────────────────────────────────────────
export const SAMPLE_JOBS = [
  {
    id: 'J001', title: 'Frontend Developer', department: 'Engineering',
    location: 'Bangalore, India', type: 'Full-time', experience: '2-4 years',
    salary: '₹8L – ₹14L', status: 'Open', deadline: '2026-12-15',
    skills: ['React', 'CSS', 'JavaScript'],
    description: 'Build modern UIs for our SaaS products using React.',
    postedDate: '2026-11-01',
    banner: { gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)', icon: 'Monitor' },
  },
  {
    id: 'J002', title: 'Backend Engineer', department: 'Engineering',
    location: 'Remote', type: 'Full-time', experience: '3-5 years',
    salary: '₹12L – ₹20L', status: 'Open', deadline: '2026-12-20',
    skills: ['Node.js', 'PostgreSQL', 'REST APIs'],
    description: 'Design scalable backend services and REST APIs.',
    postedDate: '2026-11-02',
    banner: { gradient: 'linear-gradient(135deg, #10b981, #0d9488)', icon: 'Server' },
  },
  {
    id: 'J003', title: 'HR Generalist', department: 'Human Resources',
    location: 'Mumbai, India', type: 'Full-time', experience: '1-3 years',
    salary: '₹5L – ₹8L', status: 'Open', deadline: '2026-11-30',
    skills: ['Recruitment', 'Onboarding', 'HRMS'],
    description: 'Manage end-to-end recruitment and employee onboarding.',
    postedDate: '2026-11-03',
    banner: { gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', icon: 'Users' },
  },
  {
    id: 'J004', title: 'UI/UX Designer', department: 'Design',
    location: 'Pune, India', type: 'Full-time', experience: '2-5 years',
    salary: '₹7L – ₹12L', status: 'Draft', deadline: '2026-12-31',
    skills: ['Figma', 'User Research', 'Prototyping'],
    description: 'Create intuitive user interfaces and design systems.',
    postedDate: '2026-11-04',
    banner: { gradient: 'linear-gradient(135deg, #ec4899, #a855f7)', icon: 'Palette' },
  },
  {
    id: 'J005', title: 'DevOps Engineer', department: 'Engineering',
    location: 'Hyderabad, India', type: 'Full-time', experience: '4-6 years',
    salary: '₹14L – ₹22L', status: 'Closed', deadline: '2026-11-10',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    description: 'Manage CI/CD pipelines and cloud infrastructure.',
    postedDate: '2026-10-20',
    banner: { gradient: 'linear-gradient(135deg, #1e3a8a, #0ea5e9)', icon: 'Cloud' },
  },
  {
    id: 'J006', title: 'Data Analyst', department: 'Analytics',
    location: 'Chennai, India', type: 'Full-time', experience: '1-3 years',
    salary: '₹6L – ₹10L', status: 'Open', deadline: '2026-12-25',
    skills: ['SQL', 'Python', 'Excel', 'Tableau'],
    description: 'Analyze large datasets to derive actionable business insights and build dashboards.',
    postedDate: '2026-11-05',
    banner: { gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', icon: 'BarChart3' },
  },
  {
    id: 'J007', title: 'Mobile App Developer', department: 'Engineering',
    location: 'Bangalore, India', type: 'Full-time', experience: '2-4 years',
    salary: '₹10L – ₹18L', status: 'Open', deadline: '2026-12-28',
    skills: ['React Native', 'Flutter', 'REST APIs', 'Firebase'],
    description: 'Build cross-platform mobile applications for Android and iOS users.',
    postedDate: '2026-11-06',
    banner: { gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', icon: 'Smartphone' },
  },
  {
    id: 'J008', title: 'Content Writer', department: 'Marketing',
    location: 'Remote', type: 'Part-time', experience: '0-2 years',
    salary: '₹3L – ₹5L', status: 'Open', deadline: '2026-12-18',
    skills: ['SEO', 'Copywriting', 'Blogging', 'WordPress'],
    description: 'Create engaging blog posts, website copy and social media content.',
    postedDate: '2026-11-07',
    banner: { gradient: 'linear-gradient(135deg, #f97316, #fb923c)', icon: 'PenTool' },
  },
  {
    id: 'J009', title: 'Cybersecurity Analyst', department: 'Security',
    location: 'Delhi, India', type: 'Full-time', experience: '3-6 years',
    salary: '₹15L – ₹25L', status: 'Open', deadline: '2027-01-10',
    skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Firewalls'],
    description: 'Monitor systems for threats, perform security audits and incident response.',
    postedDate: '2026-11-08',
    banner: { gradient: 'linear-gradient(135deg, #dc2626, #991b1b)', icon: 'Shield' },
  },
  {
    id: 'J010', title: 'Product Manager', department: 'Product',
    location: 'Mumbai, India', type: 'Full-time', experience: '4-7 years',
    salary: '₹18L – ₹30L', status: 'Open', deadline: '2027-01-05',
    skills: ['Roadmapping', 'Agile', 'User Stories', 'Analytics'],
    description: 'Define product strategy, prioritize features and work closely with engineering.',
    postedDate: '2026-11-08',
    banner: { gradient: 'linear-gradient(135deg, #7c3aed, #c084fc)', icon: 'Target' },
  },
  {
    id: 'J011', title: 'QA / Test Engineer', department: 'Engineering',
    location: 'Pune, India', type: 'Full-time', experience: '1-3 years',
    salary: '₹5L – ₹9L', status: 'Open', deadline: '2026-12-22',
    skills: ['Selenium', 'Manual Testing', 'JIRA', 'API Testing'],
    description: 'Write test cases, automate regression tests and ensure product quality.',
    postedDate: '2026-11-09',
    banner: { gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', icon: 'CheckSquare' },
  },
];

// ── CANDIDATES ──────────────────────────────────────────
export const SAMPLE_CANDIDATES = [
  {
    id: 'C001', name: 'Alice Kumar', email: 'alice@example.com',
    phone: '9876543210', location: 'Bangalore',
    skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
    experience: '3 years', education: 'B.Tech CSE – IIT Delhi',
    appliedJob: 'J001', appliedDate: '2026-11-05', stage: 'Interview',
    resume: 'alice_kumar_resume.pdf',
    summary: 'Passionate frontend developer with 3 years of React experience.',
  },
  {
    id: 'C002', name: 'Bob Singh', email: 'bob@example.com',
    phone: '9876500001', location: 'Remote',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs'],
    experience: '4 years', education: 'M.Tech – BITS Pilani',
    appliedJob: 'J002', appliedDate: '2026-11-06', stage: 'Screening',
    resume: 'bob_singh_resume.pdf',
    summary: 'Backend engineer with strong experience in Node.js and databases.',
  },
  {
    id: 'C003', name: 'Priya Mehta', email: 'priya@example.com',
    phone: '9900112233', location: 'Mumbai',
    skills: ['Recruitment', 'HR Operations', 'Onboarding'],
    experience: '2 years', education: 'MBA HR – Symbiosis',
    appliedJob: 'J003', appliedDate: '2026-11-04', stage: 'Selected',
    resume: 'priya_mehta_resume.pdf',
    summary: 'HR professional skilled in talent acquisition and employee engagement.',
  },
  {
    id: 'C004', name: 'Raj Patel', email: 'raj@example.com',
    phone: '9988776655', location: 'Pune',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    experience: '3 years', education: 'B.Des – NID Ahmedabad',
    appliedJob: 'J004', appliedDate: '2026-11-03', stage: 'Applied',
    resume: 'raj_patel_resume.pdf',
    summary: 'Creative UX designer with a user-first approach.',
  },
  {
    id: 'C005', name: 'Meena Nair', email: 'meena@example.com',
    phone: '9000000001', location: 'Hyderabad',
    skills: ['React', 'Vue.js', 'JavaScript', 'REST APIs'],
    experience: '2 years', education: 'B.Tech IT – VIT',
    appliedJob: 'J001', appliedDate: '2026-11-07', stage: 'Shortlisted',
    resume: 'meena_nair_resume.pdf',
    summary: 'Enthusiastic developer with hands-on React and Vue experience.',
  },
  {
    id: 'C006', name: 'Arjun Dev', email: 'arjun@example.com',
    phone: '9000000002', location: 'Chennai',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    experience: '5 years', education: 'B.Tech CSE – Anna University',
    appliedJob: 'J005', appliedDate: '2026-10-25', stage: 'Offered',
    resume: 'arjun_dev_resume.pdf',
    summary: 'DevOps specialist with deep cloud and container expertise.',
  },
  {
    id: 'C007', name: 'Pooja Sharma', email: 'pooja@example.com',
    phone: '9000000003', location: 'Bangalore',
    skills: ['React', 'JavaScript', 'Redux'],
    experience: '1 year', education: 'B.Tech CSE – PES University',
    appliedJob: 'J001', appliedDate: '2026-11-06', stage: 'Rejected',
    resume: 'pooja_sharma_resume.pdf',
    summary: 'Fresh developer eager to grow in frontend development.',
  },
];

// ── INTERVIEWS ──────────────────────────────────────────
export const SAMPLE_INTERVIEWS = [
  {
    id: 'I001', candidateId: 'C001', candidateName: 'Alice Kumar',
    jobTitle: 'Frontend Developer', date: '2026-11-14', time: '10:00',
    type: 'Online', interviewer: 'Sara HR', status: 'Scheduled',
    link: 'https://meet.example.com/interview-001',
    notes: 'Technical round – focus on React and state management.',
  },
  {
    id: 'I002', candidateId: 'C003', candidateName: 'Priya Mehta',
    jobTitle: 'HR Generalist', date: '2026-11-12', time: '14:00',
    type: 'Offline', interviewer: 'Admin User', status: 'Completed',
    link: '', notes: 'HR round – culture fit and experience discussion.',
  },
  {
    id: 'I003', candidateId: 'C002', candidateName: 'Bob Singh',
    jobTitle: 'Backend Engineer', date: '2026-11-16', time: '11:30',
    type: 'Online', interviewer: 'Sara HR', status: 'Scheduled',
    link: 'https://meet.example.com/interview-003',
    notes: 'System design round.',
  },
];

// ── OFFERS ──────────────────────────────────────────────
export const SAMPLE_OFFERS = [
  {
    id: 'O001', candidateId: 'C006', candidateName: 'Arjun Dev',
    jobTitle: 'DevOps Engineer', offeredSalary: '₹20L per annum',
    joiningDate: '2026-12-01', status: 'Pending', sentDate: '2026-11-07',
  },
  {
    id: 'O002', candidateId: 'C003', candidateName: 'Priya Mehta',
    jobTitle: 'HR Generalist', offeredSalary: '₹7L per annum',
    joiningDate: '2026-12-15', status: 'Accepted', sentDate: '2026-11-05',
  },
];

// ── NOTIFICATIONS ────────────────────────────────────────
export const SAMPLE_NOTIFICATIONS = [
  { id: 'N001', type: 'application', message: 'New application received from Alice Kumar for Frontend Developer.', time: '2 hours ago', read: false },
  { id: 'N002', type: 'interview',   message: 'Interview scheduled for Bob Singh on Nov 16 at 11:30 AM.',           time: '5 hours ago', read: false },
  { id: 'N003', type: 'offer',       message: 'Priya Mehta accepted the offer for HR Generalist.',                  time: '1 day ago',   read: true  },
  { id: 'N004', type: 'application', message: 'New application from Meena Nair for Frontend Developer.',           time: '1 day ago',   read: true  },
  { id: 'N005', type: 'status',      message: 'Arjun Dev moved to Offered stage.',                                  time: '2 days ago',  read: true  },
];

// ── PIPELINE STAGES ──────────────────────────────────────
// Order matters – candidates move left to right
export const PIPELINE_STAGES = [
  'Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Offered', 'Rejected'
];

// ── ANALYTICS DATA ───────────────────────────────────────
export const ANALYTICS_DATA = {
  applicationsByStatus: [
    { label: 'Applied',     value: 12 },
    { label: 'Screening',   value: 8  },
    { label: 'Shortlisted', value: 5  },
    { label: 'Interview',   value: 4  },
    { label: 'Selected',    value: 3  },
    { label: 'Offered',     value: 2  },
    { label: 'Rejected',    value: 6  },
  ],
  jobsByDepartment: [
    { label: 'Engineering',      value: 3 },
    { label: 'Human Resources',  value: 1 },
    { label: 'Design',           value: 1 },
  ],
  monthlyApplications: [
    { month: 'Sep', count: 5  },
    { month: 'Oct', count: 12 },
    { month: 'Nov', count: 20 },
  ],
};

