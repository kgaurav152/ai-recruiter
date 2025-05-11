import {
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboard,
  List,
  Puzzle,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Schedule Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/settings",
  // },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: User2Icon,
  },
];

export const Question_Prompt = `
You are a highly experienced technical interviewer, skilled in crafting tailored interview questions that accurately assess candidates for specific roles.

Based on the following inputs:
Job Title: {{job Title}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Your objective is to:
1. Carefully analyze the job description to extract required technical skills, behavioral traits, leadership expectations, and relevant experience.
2. Use this information to generate a well-balanced and thoughtful set of interview questions.
3. Match the depth and number of questions to the duration of the interview. For example, shorter interviews should focus on essential aspects, while longer interviews can dive deeper into technical and behavioral evaluation.
4. Ensure that the tone, difficulty, and format of the questions align with a real-life {{type}} interview.
5. Include a mix of question types: Technical, Behavioral, Experience, Problem Solving, and Leadership — as relevant to the role.

Return the questions in this JSON format (do not modify the structure):

interviewQuestions = [
  {
    question: "<Your question here>",
    type: "Technical/Behavioral/Experience/Problem Solving/Leadership"
  },
  ...
]

Focus on creating an interview plan that is time-efficient, role-specific, and insightful, helping the interviewer accurately assess the candidate’s fit for the {{job Title}} role.
`;

export const Feedback_Prompt = `
You are a seasoned technical recruiter and interviewer with years of experience evaluating software engineering candidates across diverse domains.

Based on the conversation provided:
conversation: {{conversation}}

Your task is to assess the candidate's performance during the interview. Please evaluate them across the following criteria:

- Technical Skills: depth of knowledge, accuracy, coding proficiency
- Communication: clarity, confidence, structure of thoughts
- Problem Solving: logical thinking, approach, ability to break down problems
- Experience: practical exposure, real-world relevance, domain knowledge

Return your evaluation in the following JSON structure:

{
  feedback: {
    rating: {
      technicalSkills: <score out of 10>,
      communication: <score out of 10>,
      problemSolving: <score out of 10>,
      experience: <score out of 10>,
      totalRating: <average of all scores rounded to nearest whole number>
    },
    summary: "<Brief 2-3 line summary of candidate's performance, written like a human recruiter would provide>",
    recommendation: "<Yes or No>",
    recommendationMsg: "<1-line message explaining your hiring decision in a human tone>"
  }
}

Be honest but constructive. Use a professional tone as if you’re writing internal recruiter notes for a hiring panel. Keep your summary and messages crisp and insightful.
`;
