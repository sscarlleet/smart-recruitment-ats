
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const hrEmail = process.env.SEED_HR_EMAIL;
  const hrPassword = process.env.SEED_HR_PASSWORD;
  const demoPassword = process.env.DEMO_ACCOUNT_PASSWORD;

  if (!hrEmail || !hrPassword || !demoPassword) {
    throw new Error(
      'SEED_HR_EMAIL, SEED_HR_PASSWORD and DEMO_ACCOUNT_PASSWORD must be configured in .env'
    );
  }

  for (const password of [hrPassword, demoPassword]) {
    if (
      password.length < 12 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      throw new Error('Seed passwords must be between 12 and 72 bytes.');
    }
  }

  console.log('Starting ATS demo database seeding...');

  const hrHash = await bcrypt.hash(hrPassword, 12);
  const demoHash = await bcrypt.hash(demoPassword, 12);

  // --------------------------------------------------
  // 1. PRIMARY HR ACCOUNT
  // --------------------------------------------------

  const primaryHR = await prisma.user.upsert({
    where: { email: hrEmail },
    update: {
      name: 'ATS HR Manager'
    },
    create: {
      name: 'ATS HR Manager',
      email: hrEmail,
      password: hrHash,
      role: 'HR'
    }
  });

  if (!['HR', 'ADMIN'].includes(primaryHR.role)) {
    throw new Error('SEED_HR_EMAIL must belong to an HR or Admin account.');
  }

  // --------------------------------------------------
  // 2. DEMO USERS
  // --------------------------------------------------

  const accountData = [
    {
      name: 'Neha Kulkarni',
      email: 'neha.hr@ats-demo.com',
      role: 'HR'
    },
    {
      name: 'Admin User',
      email: 'admin@ats-demo.com',
      role: 'ADMIN'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'CANDIDATE'
    },
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      role: 'CANDIDATE'
    },
    {
      name: 'Riya Patel',
      email: 'riya.patel@example.com',
      role: 'CANDIDATE'
    },
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      role: 'CANDIDATE'
    }
  ];

  const users = {};

  for (const account of accountData) {
    users[account.email] = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        role: account.role
      },
      create: {
        ...account,
        password: demoHash
      }
    });
  }

  const secondHR = users['neha.hr@ats-demo.com'];

  // --------------------------------------------------
  // 3. DEMO JOBS
  // --------------------------------------------------

  const jobData = [
    {
      title: 'Frontend Developer Intern',
      department: 'Engineering',
      location: 'Mumbai',
      description:
        'Build responsive web interfaces using React, JavaScript and modern frontend development tools.',
      employmentType: 'INTERNSHIP',
      salaryMin: 10000,
      salaryMax: 18000,
      ownerId: primaryHR.id
    },
    {
      title: 'Python Developer Intern',
      department: 'Engineering',
      location: 'Pune',
      description:
        'Assist in developing Python applications, REST APIs and backend services.',
      employmentType: 'INTERNSHIP',
      salaryMin: 12000,
      salaryMax: 20000,
      ownerId: primaryHR.id
    },
    {
      title: 'UI/UX Designer Intern',
      department: 'Design',
      location: 'Mumbai',
      description:
        'Create user-friendly interfaces, wireframes and prototypes using modern design tools.',
      employmentType: 'INTERNSHIP',
      salaryMin: 8000,
      salaryMax: 15000,
      ownerId: secondHR.id
    },
    {
      title: 'Data Analyst Intern',
      department: 'Analytics',
      location: 'Remote',
      description:
        'Work with datasets, SQL queries and dashboards to generate useful business insights.',
      employmentType: 'INTERNSHIP',
      salaryMin: 10000,
      salaryMax: 16000,
      ownerId: secondHR.id
    }
  ];

  const jobs = {};

  for (const item of jobData) {
    const { ownerId, ...jobFields } = item;

    let job = await prisma.job.findFirst({
      where: {
        title: jobFields.title,
        createdById: ownerId
      }
    });

    if (job) {
      job = await prisma.job.update({
        where: { id: job.id },
        data: {
          ...jobFields,
          status: 'PUBLISHED',
          publishedAt: job.publishedAt || new Date()
        }
      });
    } else {
      job = await prisma.job.create({
        data: {
          ...jobFields,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          createdById: ownerId
        }
      });
    }

    jobs[jobFields.title] = job;
  }

  // --------------------------------------------------
  // 4. CANDIDATE PROFILES AND EDUCATION
  // --------------------------------------------------

  const candidateData = [
    {
      email: 'priya.sharma@example.com',
      phone: '9000000001',
      location: 'Mumbai',
      headline: 'Frontend Developer | React Enthusiast',
      summary:
        'Computer science student interested in frontend development and building accessible web applications.',
      linkedinUrl: 'https://www.linkedin.com/in/priya-sharma-demo',
      portfolioUrl: 'https://priya-demo.example.com',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      institution: 'University of Mumbai',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Engineering',
      startYear: 2024,
      endYear: 2028,
      grade: '8.6 CGPA'
    },
    {
      email: 'aarav.mehta@example.com',
      phone: '9000000002',
      location: 'Pune',
      headline: 'Python Developer | Backend Enthusiast',
      summary:
        'Aspiring backend developer interested in Python, APIs and database-driven applications.',
      linkedinUrl: 'https://www.linkedin.com/in/aarav-mehta-demo',
      portfolioUrl: 'https://aarav-demo.example.com',
      skills: ['Python', 'Django', 'SQL', 'Git'],
      institution: 'Pune Institute of Computer Technology',
      degree: 'B.E.',
      fieldOfStudy: 'Information Technology',
      startYear: 2023,
      endYear: 2027,
      grade: '8.3 CGPA'
    },
    {
      email: 'riya.patel@example.com',
      phone: '9000000003',
      location: 'Thane',
      headline: 'UI/UX Designer | Creative Problem Solver',
      summary:
        'Design student interested in user research, wireframing and creating intuitive digital experiences.',
      linkedinUrl: 'https://www.linkedin.com/in/riya-patel-demo',
      portfolioUrl: 'https://riya-demo.example.com',
      skills: ['Figma', 'Wireframing', 'Prototyping', 'UI Design'],
      institution: 'SIES Graduate School of Technology',
      degree: 'B.E.',
      fieldOfStudy: 'Computer Engineering',
      startYear: 2024,
      endYear: 2028,
      grade: '8.4 CGPA'
    },
    {
      email: 'rahul.verma@example.com',
      phone: '9000000004',
      location: 'Navi Mumbai',
      headline: 'Aspiring Data Analyst',
      summary:
        'Analytical student interested in data visualization, SQL and extracting insights from datasets.',
      linkedinUrl: 'https://www.linkedin.com/in/rahul-verma-demo',
      portfolioUrl: 'https://rahul-demo.example.com',
      skills: ['SQL', 'Python', 'Excel', 'Power BI'],
      institution: 'Vivekanand Education Society Institute of Technology',
      degree: 'B.E.',
      fieldOfStudy: 'Information Technology',
      startYear: 2023,
      endYear: 2027,
      grade: '8.1 CGPA'
    }
  ];

  const candidates = {};

  for (const data of candidateData) {
    const {
      email,
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      grade,
      ...profileFields
    } = data;

    const user = users[email];

    // CandidateProfile receives ONLY profile fields.
    const profile = await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: profileFields,
      create: {
        userId: user.id,
        ...profileFields
      }
    });

    // Education fields are stored in the Education table.
    const existingEducation = await prisma.education.findFirst({
      where: {
        profileId: profile.id,
        institution,
        degree
      }
    });

    const educationFields = {
      fieldOfStudy,
      startYear,
      endYear,
      grade
    };

    if (existingEducation) {
      await prisma.education.update({
        where: { id: existingEducation.id },
        data: educationFields
      });
    } else {
      await prisma.education.create({
        data: {
          profileId: profile.id,
          institution,
          degree,
          ...educationFields
        }
      });
    }

    candidates[email] = user;
  }

  // --------------------------------------------------
  // 5. APPLICATIONS AND STATUS HISTORY
  // --------------------------------------------------

  const applicationData = [
    {
      email: 'priya.sharma@example.com',
      jobTitle: 'Frontend Developer Intern',
      status: 'SCREENING',
      coverLetter:
        'I am interested in frontend development and have experience building React projects.'
    },
    {
      email: 'aarav.mehta@example.com',
      jobTitle: 'Python Developer Intern',
      status: 'INTERVIEW',
      coverLetter:
        'I enjoy backend development and building Python-based applications.'
    },
    {
      email: 'riya.patel@example.com',
      jobTitle: 'UI/UX Designer Intern',
      status: 'APPLIED',
      coverLetter:
        'I would love to contribute my design and prototyping skills.'
    },
    {
      email: 'rahul.verma@example.com',
      jobTitle: 'Data Analyst Intern',
      status: 'REJECTED',
      coverLetter:
        'I am interested in data analytics and business intelligence.'
    }
  ];

  const statusSequences = {
    APPLIED: ['APPLIED'],
    SCREENING: ['APPLIED', 'SCREENING'],
    INTERVIEW: ['APPLIED', 'SCREENING', 'INTERVIEW'],
    REJECTED: ['APPLIED', 'REJECTED']
  };

  let applicationsCreated = 0;

  for (const item of applicationData) {
    const candidate = candidates[item.email];
    const job = jobs[item.jobTitle];

    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: candidate.id,
          jobId: job.id
        }
      }
    });

    if (existingApplication) {
      console.log(
        `Application already exists: ${item.email} -> ${item.jobTitle}`
      );
      continue;
    }

    const sequence = statusSequences[item.status];

    const historyRecords = sequence.map((status, index) => ({
      changedById:
        index === 0 ? candidate.id : job.createdById,
      fromStatus: index === 0 ? null : sequence[index - 1],
      toStatus: status,
      note:
        index === 0
          ? 'Application submitted'
          : `Application moved to ${status} during demo seeding`
    }));

    await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        coverLetter: item.coverLetter,
        status: item.status,
        statusHistory: {
          create: historyRecords
        }
      }
    });

    applicationsCreated++;
  }

  // --------------------------------------------------
  // 6. SUMMARY
  // --------------------------------------------------

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.applicationStatusHistory.count(),
    prisma.candidateProfile.count(),
    prisma.education.count()
  ]);

  console.log('\n======================================');
  console.log('ATS DEMO DATA SEEDED SUCCESSFULLY');
  console.log('======================================');

  console.log('Primary HR:', primaryHR.email);
  console.log('Additional HR: neha.hr@ats-demo.com');
  console.log('Admin: admin@ats-demo.com');

  console.log('New demo candidates:', candidateData.length);
  console.log('New demo jobs:', jobData.length);
  console.log('New applications created:', applicationsCreated);

  console.log('\nCURRENT DATABASE TOTALS');
  console.log('Users:', counts[0]);
  console.log('Jobs:', counts[1]);
  console.log('Applications:', counts[2]);
  console.log('Status history records:', counts[3]);
  console.log('Candidate profiles:', counts[4]);
  console.log('Education records:', counts[5]);

  console.log('\nNew demo accounts use DEMO_ACCOUNT_PASSWORD from .env.');
  console.log('Existing application records and histories were preserved.');
}

main()
  .catch((error) => {
    console.error('\nDEMO SEEDING FAILED:');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
