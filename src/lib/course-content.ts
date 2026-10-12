export type CourseAccent = "green" | "clay";

export type CourseResource = {
  label: string;
  href: string;
  note?: string;
};

export type CourseVideo = {
  title: string;
  duration: string;
  description: string;
  videoUrl?: string;
  posterUrl?: string;
};

export type CourseSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type CourseLesson = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  duration: string;
  introduction: string;
  outcome: string;
  video?: CourseVideo;
  sections: CourseSection[];
  actions: string[];
  reflection: string;
  takeaway: string;
  resources?: CourseResource[];
  interactive?: "van-fund-calculator";
};

export type CourseDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  label: string;
  priceLabel: string;
  accent: CourseAccent;
  description: string;
  promise: string;
  audience: string;
  duration: string;
  format: string;
  videoCount: number;
  outcomes: string[];
  disclaimer?: string;
  lessons: CourseLesson[];
};

export const COURSES: CourseDefinition[] = [
  {
    slug: "van-fund",
    title: "The Van Fund",
    shortTitle: "Van Fund",
    label: "Money for the road",
    priceLabel: "Free course",
    accent: "green",
    description:
      "Price the whole campervan dream, protect your safety net, and turn the gap into a savings rhythm you can actually keep.",
    promise:
      "Leave with an honest target, a weekly savings number, and a practical system for moving toward the keys.",
    audience:
      "For future van travellers who want a grounded plan before they browse another listing.",
    duration: "5 lessons · about 75 minutes",
    format: "Mostly written · 3 short videos · live calculator",
    videoCount: 3,
    disclaimer:
      "General educational information for an Australian audience. It is not personal financial advice or an investment recommendation.",
    outcomes: [
      "A complete van, setup, trip, and contingency target",
      "A separate plan for emergency savings and the Van Fund",
      "A payday automation rule and realistic departure timeline",
      "One sustainable cost-saving move and one income experiment",
    ],
    lessons: [
      {
        slug: "price-the-whole-road",
        number: "01",
        title: "Price the whole road",
        shortTitle: "Price the road",
        eyebrow: "Make the dream measurable",
        duration: "15 min",
        introduction:
          "The useful number is not the price in the listing. It includes buying the vehicle, making it road-ready, taking the trip, and staying safe when something goes wrong.",
        outcome: "Build one researched, all-in target for your version of van life.",
        video: {
          title: "The number the dream reel leaves out",
          duration: "4–5 min",
          description:
            "A personal welcome from Vanessa and a quick walkthrough of the four cost groups she would price before choosing a van.",
        },
        sections: [
          {
            title: "Start with four cost groups",
            paragraphs: [
              "A cheap vehicle can still create an expensive year. Research each group separately so one attractive listing does not become your whole budget.",
            ],
            bullets: [
              "Vehicle: purchase, inspection, transfer, registration, and insurance.",
              "Road-ready setup: initial service, tyres, repairs, fit-out, and basic gear.",
              "Trip: fuel, campsites, food, tolls, parking, activities, and getting home.",
              "Van-specific buffer: repairs and surprises that are separate from your everyday emergency fund.",
            ],
          },
          {
            title: "Research before you average",
            paragraphs: [
              "Use real listings, quotes, route distances, and current fees for the place where you will buy and travel. Keep a low, likely, and high estimate until you have enough evidence to choose one.",
              "The calculator below is a planning model, not a prediction. Its job is to show what your assumptions mean per month and per week.",
            ],
          },
        ],
        actions: [
          "Collect three realistic vehicle listings.",
          "Price an inspection, registration, insurance, and the first service.",
          "Choose a travel duration and edit the trip-spending plan for your route.",
          "Enter only conservative, dependable income you expect while travelling.",
          "Choose a van-specific contingency that is not your emergency fund.",
        ],
        reflection: "Which cost was missing from the number you had in your head?",
        takeaway: "Your target is the whole road—not just the keys.",
        interactive: "van-fund-calculator",
        resources: [
          {
            label: "MoneySmart savings goals calculator",
            href: "https://moneysmart.gov.au/saving/savings-goals-calculator",
            note: "Compare your estimate with the Australian Government calculator.",
          },
        ],
      },
      {
        slug: "protect-the-dream",
        number: "02",
        title: "Protect the dream",
        shortTitle: "Protect the dream",
        eyebrow: "Keep two jobs separate",
        duration: "12 min",
        introduction:
          "The Van Fund pays for a planned goal. Emergency savings protect essential life when the unplanned happens. Counting the same money for both creates false confidence.",
        outcome: "Set distinct targets for emergency savings and van travel.",
        sections: [
          {
            title: "Emergency money is not van money",
            paragraphs: [
              "An emergency fund is for urgent costs when other money is not available. MoneySmart describes three months of expenses as a useful target while also encouraging people to begin with whatever small amount they can sustain.",
              "Your personal target depends on your expenses, income stability, responsibilities, and access to support. This course does not choose that number for you.",
            ],
          },
          {
            title: "Give each account one sentence",
            paragraphs: [
              "Write a plain rule for when each pool can be used. A named account and a written rule add enough friction to interrupt an emotional transfer.",
            ],
            bullets: [
              "Emergency fund: urgent essential expenses when other money is unavailable.",
              "Van Fund: planned vehicle, setup, travel, and van-specific repair costs.",
            ],
          },
        ],
        actions: [
          "Calculate one month of essential expenses.",
          "Choose an emergency-fund target that fits your circumstances.",
          "Write one permitted-use rule for each savings pool.",
        ],
        reflection: "Would buying the van today leave your essential life exposed?",
        takeaway: "A dream feels freer when it is not borrowing from your safety net.",
        resources: [
          {
            label: "MoneySmart emergency-fund guide",
            href: "https://moneysmart.gov.au/saving/save-for-an-emergency-fund",
          },
        ],
      },
      {
        slug: "build-your-van-fund",
        number: "03",
        title: "Build your Van Fund",
        shortTitle: "Build the fund",
        eyebrow: "Create the system",
        duration: "15 min",
        introduction:
          "A goal gets easier to trust when the money has its own home, the transfer happens automatically, and every payday creates visible progress.",
        outcome: "Create a separate account, payday rule, and progress ritual.",
        video: {
          title: "My low-drama payday routine",
          duration: "4–6 min",
          description:
            "Vanessa explains the behavioural side of saving: separating the goal, automating first, and checking progress without obsessing.",
        },
        sections: [
          {
            title: "Separate, automate, sweep",
            paragraphs: [
              "A separate savings account makes progress visible and casual spending harder. Compare the ongoing interest rate, bonus conditions, fees, withdrawal rules, and access before opening one.",
            ],
            bullets: [
              "Separate: open or rename an account for this goal only.",
              "Automate: schedule the transfer for the day income arrives.",
              "Sweep: choose a percentage of windfalls or extra income for the fund.",
            ],
          },
          {
            title: "Make the rule boring",
            paragraphs: [
              "A useful rule is specific enough to run without a weekly debate: ‘Every payday, $___ moves to the Van Fund before I decide what remains to spend.’ Start below your maximum and increase it after the habit survives real life.",
            ],
          },
        ],
        actions: [
          "Open or rename a separate savings account.",
          "Schedule the first automatic transfer.",
          "Choose a rule for windfalls and extra income.",
          "Add a monthly five-minute progress check to your calendar.",
        ],
        reflection: "What transfer could continue even during an ordinary, imperfect month?",
        takeaway: "Consistency should come from the system, not a heroic mood.",
        resources: [
          {
            label: "MoneySmart guide to savings accounts",
            href: "https://moneysmart.gov.au/banking/savings-accounts",
          },
        ],
      },
      {
        slug: "start-before-ready",
        number: "04",
        title: "Start before you feel ready",
        shortTitle: "Start early",
        eyebrow: "Let time reduce the pressure",
        duration: "14 min",
        introduction:
          "For a shorter savings goal, starting earlier matters mainly because the same gap is divided across more paydays. Waiting for a perfect month makes every later month carry more weight.",
        outcome: "Choose a departure window and make the first transfer within 24 hours.",
        sections: [
          {
            title: "Match the money to the date",
            paragraphs: [
              "The goal date affects both the weekly amount and the level of investment risk you can reasonably tolerate. MoneySmart describes cash such as savings accounts and term deposits as suited to short time frames around zero to three years, while growth assets can move sharply over short periods.",
              "This is general education only. If you need a recommendation for your circumstances, speak with a licensed financial adviser.",
            ],
          },
          {
            title: "Use the 24-hour start",
            paragraphs: [
              "Transfer a small amount today, then schedule the sustainable payday amount. The purpose of the first transfer is not its size—it is evidence that the system has begun.",
            ],
          },
        ],
        actions: [
          "Choose an earliest and latest realistic departure month.",
          "Compare the weekly number for both dates.",
          "Make a first transfer within 24 hours.",
        ],
        reflection: "What changes if you leave three or six months later rather than making the weekly plan punishing?",
        takeaway: "A flexible date can protect a sustainable plan.",
        resources: [
          {
            label: "MoneySmart: choose your investments",
            href: "https://moneysmart.gov.au/how-to-invest/choose-your-investments",
          },
        ],
      },
      {
        slug: "close-the-gap",
        number: "05",
        title: "Close the gap gently",
        shortTitle: "Close the gap",
        eyebrow: "Use both levers",
        duration: "16 min",
        introduction:
          "Cutting costs has a floor. Income has more room, but it also takes time and energy. A livable plan uses one modest move on each side instead of turning life into a punishment.",
        outcome: "Choose one expense change and one small income experiment for this month.",
        video: {
          title: "Funding freedom without hating the present",
          duration: "5–6 min",
          description:
            "A grounded closing note from Vanessa about balancing future travel with a life that still feels good now.",
        },
        sections: [
          {
            title: "Save more without shrinking everything",
            paragraphs: [
              "Look first for recurring costs that deliver little value, purchases made from friction or boredom, and things you can sell without regret. Keep a guilt-free weekly amount so the plan can last.",
            ],
          },
          {
            title: "Earn more with a defined experiment",
            paragraphs: [
              "Choose one buyer, one useful result, and one small offer: a casual shift, a freelance task, a local UGC package, a practical guide, or a short teaching session. Track time, costs, revenue, and whether you would repeat it.",
              "Extra income may create tax and record-keeping obligations. Check current ATO guidance or speak with a registered tax professional for your situation.",
            ],
          },
        ],
        actions: [
          "Choose one low-value recurring cost to cancel or renegotiate.",
          "Choose one income experiment with a named buyer and result.",
          "Send part of the first extra income directly to the Van Fund.",
          "Schedule your next monthly review.",
        ],
        reflection: "Which plan would you still be willing to follow six months from now?",
        takeaway: "The best plan funds the road without making you resent the life before it.",
      },
    ],
  },
  {
    slug: "the-course-course",
    title: "The Course Course",
    shortTitle: "Course Course",
    label: "Turn knowledge into a product",
    priceLabel: "Founding edition",
    accent: "clay",
    description:
      "Turn something useful you know into a focused first course you can test, explain, and improve with real people.",
    promise:
      "Finish with a tested idea, a clear student and transformation, a lean curriculum, an offer, a sales page, and a first-customer plan.",
    audience:
      "For practical creators and professionals with useful experience—not people chasing a passive-income shortcut.",
    duration: "6 lessons · about 2 hours",
    format: "Written build sprint · 4 short videos · saved workbook prompts",
    videoCount: 4,
    outcomes: [
      "One evidence-backed course concept",
      "A specific student, problem, and responsible promise",
      "A minimum viable curriculum and delivery plan",
      "A clear offer, sales page outline, and launch plan",
    ],
    lessons: [
      {
        slug: "find-your-useful-thing",
        number: "01",
        title: "Find your useful thing",
        shortTitle: "Find the idea",
        eyebrow: "Start with proof, not trends",
        duration: "20 min",
        introduction:
          "A good first course begins with progress you can genuinely help someone make. Your advantage may be a result, repeatable process, lived context, or mistake you can help another person avoid.",
        outcome: "Choose one course thesis that names a person, problem, result, and path.",
        video: {
          title: "You probably know something useful already",
          duration: "5–7 min",
          description:
            "Vanessa opens the build sprint with her own shift from a broad UGC topic to a specific result for an early travel creator.",
        },
        sections: [
          {
            title: "Inventory evidence that you can help",
            paragraphs: [
              "List results you have created, processes you repeat, questions people bring to you, communities you understand from inside, and mistakes you can help someone avoid. Do not filter for course ideas yet.",
            ],
          },
          {
            title: "Move from topic to useful result",
            paragraphs: [
              "‘Travel photography’ is a topic. ‘Take and edit a coherent set of phone travel photos in seven days’ is a result someone can understand and test.",
              "Score your strongest ideas for problem strength, access to potential students, evidence you can help, speed of the result, and willingness to teach it repeatedly.",
            ],
          },
        ],
        actions: [
          "Write at least ten entries in a proof-I-can-help inventory.",
          "Turn the strongest three into person → problem → result statements.",
          "Score the three ideas and choose one thesis for the next lesson.",
        ],
        reflection: "What do people already trust you to explain, fix, or make easier?",
        takeaway: "Specific useful progress is a stronger foundation than a broad passion.",
      },
      {
        slug: "find-the-person",
        number: "02",
        title: "Find the person who wants it",
        shortTitle: "Find the student",
        eyebrow: "Replace assumptions with conversations",
        duration: "22 min",
        introduction:
          "The first student is defined by a situation and behaviour, not a vague demographic. Meaningful conversations show you the words, costs, failed attempts, and constraints around the problem.",
        outcome: "Create a first-student profile and a ten-conversation research plan.",
        video: {
          title: "How to research without secretly pitching",
          duration: "6–8 min",
          description:
            "A natural demonstration of the questions Vanessa would ask and the difference between a compliment and useful evidence.",
        },
        sections: [
          {
            title: "Describe the situation, not a stereotype",
            paragraphs: [
              "Capture the student’s current situation, attempted solutions, constraints, desired progress, and where they already look for help. Use language from real conversations as soon as you have it.",
            ],
          },
          {
            title: "Run the ten-person test",
            paragraphs: [
              "Ask what they are trying to achieve, what is hard now, what they have tried, what happened, what the problem costs, and what a useful solution would need to help them do. Avoid leading questions and do not turn the call into a disguised pitch.",
            ],
            bullets: [
              "Weak signal: ‘That sounds cool.’",
              "Better signal: a repeated and costly problem.",
              "Stronger signal: prior attempts or spending.",
              "Strongest early signal: a deposit, preorder, or commitment to a pilot.",
            ],
          },
        ],
        actions: [
          "Write a one-page first-student profile.",
          "Invite ten relevant people to a short research conversation.",
          "Create a language bank for repeated phrases, alternatives, and objections.",
          "Decide whether to continue, narrow, change, or stop.",
        ],
        reflection: "What evidence would genuinely change your decision to build this course?",
        takeaway: "Compliments feel good; changed decisions are useful.",
      },
      {
        slug: "design-the-transformation",
        number: "03",
        title: "Design the transformation",
        shortTitle: "Design the result",
        eyebrow: "Make the promise responsible",
        duration: "18 min",
        introduction:
          "A credible course promise describes observable progress the teaching can materially affect. It does not promise earnings, employment, customers, or other outcomes outside the student’s and instructor’s control.",
        outcome: "Write a believable A → B promise and map the milestones backwards.",
        sections: [
          {
            title: "Define observable A and B",
            paragraphs: [
              "Point A is the student’s current observable state. Point B is an outcome they can recognise and demonstrate. Pressure-test the result for specificity, relevance, agency, scope, time, and effort.",
            ],
          },
          {
            title: "Map the path backwards",
            paragraphs: [
              "Begin at the result and ask what the student must do immediately before it, what they must decide or have before that, which barriers will appear, and what proof shows each step is complete.",
            ],
          },
        ],
        actions: [
          "Write a before-and-after statement using customer language.",
          "Write the promise and what it explicitly does not guarantee.",
          "Map milestones, likely barriers, and proof of completion.",
          "Remove any milestone that is merely interesting rather than necessary.",
        ],
        reflection: "Could a student and a stranger both judge whether your promised result happened?",
        takeaway: "Promise capable actions and completed assets—not outcomes you cannot control.",
      },
      {
        slug: "build-the-smallest-version",
        number: "04",
        title: "Build the smallest useful version",
        shortTitle: "Build the course",
        eyebrow: "Teach the path, not a content library",
        duration: "22 min",
        introduction:
          "A minimum viable course is the smallest experience capable of helping the first students make the promised progress. Production volume is not the same as usefulness.",
        outcome: "Create a six-module-or-less curriculum and choose the lightest useful format for each lesson.",
        video: {
          title: "What deserves a video—and what does not",
          duration: "5–7 min",
          description:
            "Vanessa walks through a sample lesson and chooses between a short video, written note, checklist, template, worked example, or live feedback.",
        },
        sections: [
          {
            title: "Curriculum is a sequence of actions",
            paragraphs: [
              "Use one module for each meaningful milestone. A useful lesson contains a decision or skill, concise explanation, relevant example, student action, and completion check.",
            ],
          },
          {
            title: "Choose the lightest useful teaching object",
            paragraphs: [
              "Use video for demonstration, emotion, nuance, or personal context. Use writing for reference. Use a checklist for repeatable execution, a template for structured output, and live feedback when judgement matters.",
              "The pilot can run live or in a lightweight workspace. Record only what is stable enough to remain useful.",
            ],
          },
        ],
        actions: [
          "Create a course map with no more than six core modules.",
          "Give every lesson one student action and completion check.",
          "Assign the lightest useful format to every lesson.",
          "Build module one and outline the master workbook before polishing video.",
        ],
        reflection: "What content are you planning because it helps the result—and what are you planning because it makes the course look bigger?",
        takeaway: "The first version needs a clear path, not a giant library.",
      },
      {
        slug: "make-it-buyable",
        number: "05",
        title: "Make it buyable",
        shortTitle: "Shape the offer",
        eyebrow: "Explain the value plainly",
        duration: "20 min",
        introduction:
          "The offer includes the outcome, delivery, support, effort, terms, price, and boundaries. All of those choices affect whether the course is useful and economically sustainable.",
        outcome: "Complete an offer brief, choose a founding price, and outline a clear sales page.",
        sections: [
          {
            title: "Design the whole offer",
            paragraphs: [
              "Define the core outcome, delivery format, access period, tools, support, student effort, prerequisites, start terms, refund boundary, and support limits.",
            ],
          },
          {
            title: "Price the first version honestly",
            paragraphs: [
              "Consider useful value, alternatives, delivery cost, support time, fees, tax, refunds, and how much proof the version has. A founding price may reflect lower proof and higher instructor access without fake countdowns or invented scarcity.",
              "A sales page should let a stranger explain who it is for, what changes, what is included, what it costs, and what is not promised.",
            ],
          },
        ],
        actions: [
          "Complete a one-page offer brief.",
          "Estimate variable cost and support time per student.",
          "Choose a founding price and a condition for reviewing it.",
          "Draft the eight-section sales-page outline.",
        ],
        reflection: "What would a careful buyer need to know before feeling good about saying yes?",
        takeaway: "Clarity is part of the product, not just the marketing.",
      },
      {
        slug: "sell-learn-improve",
        number: "06",
        title: "Sell, learn, improve",
        shortTitle: "Launch and learn",
        eyebrow: "Put it in front of real people",
        duration: "20 min",
        introduction:
          "The first launch is a learning system. Start with channels that create conversations, deliver the smallest credible version well, and let student behaviour decide what version two needs.",
        outcome: "Create a first-30 customer map, launch sequence, and feedback loop.",
        video: {
          title: "The first launch without guru theatre",
          duration: "6–8 min",
          description:
            "A closing talk about personal outreach, useful teaching, honest invitations, and improving the course from real student friction.",
        },
        sections: [
          {
            title: "Find the first right people",
            paragraphs: [
              "Begin with research participants who asked to see the offer, relevant personal outreach, existing clients or peers, a small live workshop, useful content, and aligned communities where participation is welcome.",
            ],
          },
          {
            title: "Build the learning flywheel",
            paragraphs: [
              "Track where students do not start, pause, ask repeated questions, produce weak work, get a quick win, and describe the value in their own words. Improve the confusing path and missing support before adding production polish.",
            ],
          },
        ],
        actions: [
          "List the first 30 appropriate people or places.",
          "Choose three acquisition actions for launch week.",
          "Write a simple problem → teaching → invitation launch sequence.",
          "Create a feedback form and version-two change log.",
          "Show the offer to the next right person.",
        ],
        reflection: "What will you learn from the first launch even if the answer is not an immediate sale?",
        takeaway: "Finishing means showing the offer—not endlessly improving it in private.",
      },
    ],
  },
];

export function getCourse(slug: string): CourseDefinition | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function getCourseLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const lessonIndex = course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (lessonIndex < 0) return undefined;
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}
