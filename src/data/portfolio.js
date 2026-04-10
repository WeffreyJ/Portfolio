export const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/resume", label: "Resume" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const siteContent = {
  owner: {
    name: "Jeffrey Walker",
    title: "Controls, Robotics, and Autonomy Engineer",
    shortTitle: "Mechanical Engineer and Controls/Autonomy Researcher",
    email: "jfw69@drexel.edu",
    githubUrl: "https://github.com/WeffreyJ",
    linkedinUrl: "https://www.linkedin.com/in/jeffrey-walker-4b2314218/",
    resumePdf: "/assets/docs/jeffrey-walker-controls-resume.pdf",
    headshot: "/assets/headshot/memoji.svg",
  },
  hero: {
    eyebrow: "Controls • Robotics • Autonomy • Embedded Systems",
    headline:
      "I build things that either converge — or teach me exactly why they don't.",
    subhead:
      "Controls, autonomy, robotics, embedded systems, and simulation-heavy engineering.",
    body:
      "Case studies in nonlinear flight control, cable-driven robotics, SLAM, and applied vision, built around what was modeled, tested, and made legible.",
    primaryCta: "View selected projects",
    secondaryCta: "Open F-18 case study",
  },
  summary: {
    title: "The work, distilled",
    body:
      "A small set of case studies chosen for clear evidence, readable engineering decisions, and direct hiring relevance.",
    notes: [
      "Start with F-18 for controls, SpiRob for hardware, and SLAM for perception and navigation.",
      "Each page is built around evidence rather than a generic project summary.",
      "Supporting work stays available without competing with the strongest proof.",
    ],
  },
  homeSignals: [
    {
      title: "Primary disciplines",
      body: "Nonlinear control, robotics, autonomy, embedded systems, and simulation-backed engineering.",
    },
    {
      title: "Best first read",
      body: "The F-18 page goes deepest. Start there if you want to understand the controls work.",
    },
    {
      title: "Best perception proof",
      body: "The SLAM page gives the portfolio a more credible perception and robotics-navigation dimension.",
    },
    {
      title: "Proof style",
      body: "Plots, hardware images, validation framing, and implementation decisions instead of generic claims.",
    },
  ],
  projectPreview: [
    {
      title: "F-18 Flight Control",
      body: "Nonlinear control, RL evaluation, and open-loop versus closed-loop evidence.",
      route: "/projects/f18",
    },
    {
      title: "SpiRob Soft Robot",
      body: "Physical robotics, embedded actuation, and a clean bridge from hardware into modeling.",
      route: "/projects/spirob",
    },
    {
      title: "Stereo SLAM",
      body: "Perception and trajectory-inspection work that broadens the portfolio beyond controls alone.",
      route: "/projects/slam",
    },
  ],
};

export const technicalAreas = [
  "Nonlinear Control",
  "Autonomy",
  "Robotics",
  "Embedded Systems",
  "Simulation and Validation",
  "Reinforcement Learning",
  "Perception",
  "Sensor Fusion",
];

export const heroProjects = [
  {
    id: "f18",
    title: "Nonlinear F-18 Flight Control",
    hook:
      "Classical plus RL control on a NASA-derived nonlinear aircraft model.",
    tags: ["Nonlinear Control", "RL", "Aircraft Dynamics", "Simulation"],
    icon: "plane",
    status: "Flagship case study",
    evidenceCue: "FlightGear closed-loop video, recovery plots, and open-loop contrast.",
  },
  {
    id: "spirob",
    title: "SpiRob Cable-Driven Soft Robot",
    hook:
      "Cable-driven soft robot with embedded actuation, wave motion, and real hardware evidence.",
    tags: ["Robotics", "Embedded", "Arduino", "Mechatronics"],
    icon: "waves",
    status: "Flagship case study",
    evidenceCue: "Hardware photos, motion clips, embedded bench setup, and simulation files.",
  },
  {
    id: "slam",
    title: "Stereo SLAM for UAV Workflows",
    hook:
      "Stereo SLAM workflow focused on reconstruction, trajectory inspection, and readable outputs.",
    tags: ["SLAM", "UAV", "Perception", "Trajectory Analysis"],
    icon: "eye",
    status: "Case study",
    evidenceCue: "Reconstruction view, pose viewer, workflow video, and repo-backed pipeline.",
  },
  {
    id: "sensorfusion",
    title: "Sensor Fusion Navigation",
    hook:
      "EKF-based IMU and GPS state estimation under dropout and noisy measurements.",
    tags: ["Sensor Fusion", "EKF", "Navigation"],
    icon: "cpu",
    status: "Exploratory study",
    evidenceCue: "Estimation study organized around dropout robustness and navigation behavior.",
  },
  {
    id: "vision",
    title: "Vision Safety Monitoring System",
    hook:
      "OpenCV monitoring pipeline with no-go zones, posture labels, and entry or exit alerts.",
    tags: ["Computer Vision", "YOLO", "Python"],
    icon: "eye",
    status: "Case study",
    evidenceCue: "Repo-backed architecture, runtime interaction, and logged alert artifacts.",
  },
];

export const supportingProjects = [
  {
    title: "AeroPendulum Reinforcement Learning",
    description:
      "Nonlinear control and reinforcement-learning experiments on an aeropendulum system with simulation-backed evaluation. A classic underactuated control problem used to benchmark controller behavior before moving to more complex platforms.",
    tags: ["RL", "Control", "MATLAB"],
    videoMedia: {
      title: "AeroPendulum demo",
      caption: "Hardware demonstration of the aeropendulum system under control.",
      src: "/assets/aeropendulum/577CC18A-5BC1-44D0-B74F-7CED16257440.MP4",
      mimeType: "video/mp4",
      type: "video",
    },
  },
  {
    title: "Hybrid Flatness and Order-Dynamic Control Research",
    description:
      "Verification-first research tooling around state-dependent ordering and advanced control-theory questions.",
    tags: ["Research", "Control Theory"],
  },
];

export const resumeContent = {
  profileStatement:
    "Mechanical engineer building across controls, autonomy, robotics, embedded systems, and simulation-heavy workflows.",
  roleFit: [
    "Controls, autonomy, and GNC roles",
    "Robotics, embedded, and mechatronics roles",
    "Simulation-heavy systems engineering",
    "Research-oriented engineering teams",
  ],
  highlights: [
    {
      title: "Graduate Research Assistant — Aircraft Control and Autonomy",
      body:
        "Built nonlinear flight-control workflows around a NASA-derived F-18 model and evaluated them through simulation, rollout analysis, and visual validation.",
    },
    {
      title: "Embedded and Controls Engineering Work",
      body:
        "Built firmware and control logic across robotics and device prototypes, including Arduino and ESP32 systems, actuators, and safety-minded embedded behavior.",
    },
    {
      title: "Perception and Navigation Workflows",
      body:
        "Added SLAM, state-estimation, and vision workflows that make the portfolio broader than pure controls while staying systems-oriented.",
    },
    {
      title: "Research and Technical Communication",
      body:
        "Produce technical writeups, simulation studies, and case-study pages that make the engineering decisions readable.",
    },
  ],
  skillBuckets: [
    {
      title: "Core engineering",
      items: ["Control systems", "Robotics", "Simulation", "Embedded systems", "Mechatronics"],
    },
    {
      title: "Software and tools",
      items: ["Python", "MATLAB/Simulink", "C++", "Arduino", "Git"],
    },
    {
      title: "Advanced workflows",
      items: ["Reinforcement learning", "State estimation", "Flight dynamics", "Validation", "Technical research"],
    },
  ],
  profileBullets: [
    "M.S. Mechanical Engineering with robotics, systems, and controls focus",
    "Thesis direction: nonlinear aircraft control with classical and RL methods",
    "Hands-on robotics, embedded systems, and simulation work",
    "Portfolio built around evidence-heavy technical case studies",
  ],
};

export const aboutThemes = [
  {
    title: "Validation matters.",
    body: "Plots, hardware, and estimation outputs need to be readable enough to support a real engineering claim.",
  },
  {
    title: "The same ideas travel well.",
    body: "Aircraft control, soft robotics, and SLAM look different, but the underlying systems thinking carries across them.",
  },
  {
    title: "Simulation is not the end of the story.",
    body: "The bench, the runtime, and the failure mode usually teach more than the first clean model does.",
  },
];

export const contactLinks = [
  {
    label: "Email",
    icon: "mail",
    value: siteContent.owner.email,
    href: `mailto:${siteContent.owner.email}`,
  },
  {
    label: "GitHub",
    icon: "github",
    value: siteContent.owner.githubUrl.replace("https://", ""),
    href: siteContent.owner.githubUrl,
  },
  {
    label: "LinkedIn",
    icon: "arrow",
    value: siteContent.owner.linkedinUrl.replace("https://", ""),
    href: siteContent.owner.linkedinUrl,
  },
  {
    label: "Resume",
    icon: "file",
    value: "Open controls/autonomy resume",
    href: siteContent.owner.resumePdf,
  },
];

export const routeTitles = {
  "/": "Jeffrey Walker | Controls, Robotics, Autonomy",
  "/projects": "Projects | Jeffrey Walker",
  "/resume": "Resume | Jeffrey Walker",
  "/about": "About | Jeffrey Walker",
  "/contact": "Contact | Jeffrey Walker",
};

export const projectPages = {
  f18: {
    id: "f18",
    title: "Nonlinear F-18 Flight Control",
    badge: ["Flagship case study", "High-fidelity simulation", "Flight visualization"],
    intro:
      "Built and evaluated a nonlinear aircraft control workflow that combined classical control methods and reinforcement learning on a high-fidelity F-18 simulation environment. The project is strongest when framed around one question: can the controller stabilize a difficult nonlinear aircraft model in a way that is both technically credible and visually defensible?",
    heroMedia: {
      title: "Closed-loop FlightGear visualization",
      caption:
        "The strongest proof artifact on the page: a closed-loop FlightGear run showing the aircraft actively recovering under regulation rather than leaving the behavior abstract.",
      src: "/assets/f18/f18full_DUTrim_stab_sim_30s.mp4",
      poster: "/assets/f18/closedloop/V.png",
      mimeType: "video/mp4",
      type: "video",
    },
    metrics: [
      "NASA-derived nonlinear F-18 model",
      "Classical control plus reinforcement-learning workflow",
      "Open-loop versus closed-loop comparison plots",
      "Visualization-ready validation assets for technical storytelling",
    ],
    resultCards: [
      {
        value: "Up to 61%",
        label: "peak excursion reduction",
        note: "Across primary aircraft states in evaluated closed-loop comparisons.",
      },
      {
        value: "PPO + classical",
        label: "control workflow",
        note: "Stable-Baselines3 PPO explored alongside classical baselines rather than replacing control intuition.",
      },
      {
        value: "FlightGear",
        label: "visual proof layer",
        note: "Closed-loop aircraft behavior made visible and reviewable instead of hidden inside traces alone.",
      },
    ],
    challenge:
      "The underlying aircraft dynamics are nonlinear, coupled, and difficult to reason about from intuition alone. A strong portfolio version of this work needs to show not only that a controller was built, but why the chosen workflow improved behavior and how that improvement was validated.",
    storyline: [
      {
        title: "The problem",
        body:
          "Aircraft control is hard because the dynamics are nonlinear, coupled, and safety-sensitive. Learned control only matters if it performs credibly in a technically serious environment instead of a toy benchmark.",
      },
      {
        title: "The setup",
        body:
          "This project uses a NASA-derived nonlinear F-18 model and studies controller behavior in a richer simulation environment where classical control reasoning and RL workflows both matter.",
      },
      {
        title: "The comparison",
        body:
          "The open-loop versus closed-loop contrast is what makes the page believable. Without regulation the motion is less disciplined and more oscillatory. With control the response becomes bounded, recoverable, and interpretable.",
      },
    ],
    architecture: [
      {
        title: "System context",
        body:
          "The work is centered on a NASA-derived F-18 model used as a high-fidelity nonlinear environment for testing flight-control behavior under realistic state interactions rather than idealized linear assumptions.",
      },
      {
        title: "Control approach",
        body:
          "The workflow combines classical-control intuition with reinforcement-learning experimentation, using each where it adds value instead of forcing the entire problem into one methodology.",
      },
      {
        title: "Evaluation method",
        body:
          "The project is evaluated through open-loop versus closed-loop traces, control-input behavior, and visual evidence that the regulated system recovers from disruptive transients more cleanly than the unregulated baseline.",
      },
    ],
    workflow: [
      {
        title: "1. Define the control problem",
        body:
          "Identify the state variables and operating behaviors that matter most for recoverability, stability, and intelligible validation plots.",
      },
      {
        title: "2. Build a comparison-driven workflow",
        body:
          "Organize the experiment so the before-versus-after behavior is obvious: open-loop oscillation and excursion on one side, regulated response and bounded recovery on the other.",
      },
      {
        title: "3. Use visuals as technical evidence",
        body:
          "Treat plots and simulation imagery as part of the engineering argument rather than decorative media. Each one should answer a specific validation question.",
      },
    ],
    engineeringValue: [
      "Nonlinear dynamic-system modeling and control reasoning",
      "Simulation-heavy experimentation and rollout analysis",
      "Stable-Baselines3 PPO evaluation in a nontrivial environment",
      "Technical interpretation that stays grounded in observable behavior",
    ],
    validationQuestions: [
      "Do velocity and altitude recover after a strong transient instead of remaining unstable or oscillatory?",
      "Do angle variables remain bounded and interpretable under correction rather than diverging?",
      "Does control effort show aggressive but understandable intervention before returning toward trim?",
      "Does the open-loop baseline make the controller benefit immediately obvious to a reviewer?",
    ],
    hiringTakeaways: [
      "Demonstrates the ability to move from dynamic-system modeling to evaluation infrastructure and readable technical evidence.",
      "Maps to controls, autonomy, GNC, aerospace-adjacent, and advanced systems engineering work.",
      "Engineering judgment shows through comparison, interpretation, and honest framing — not vague capability claims.",
    ],
    sections: [
      {
        title: "Why this page matters",
        body:
          "This project sits at the intersection of modeling, control design, RL experimentation, and technical communication. It should read as a serious engineering artifact — the kind where the decisions behind the plots are as legible as the plots themselves.",
      },
      {
        title: "Best next additions",
        body:
          "The highest-value upgrades are a FlightGear still or short clip, one concise architecture diagram, and one paragraph explaining where classical-control reasoning ended and RL experimentation began.",
      },
    ],
    closedLoopAssets: [
      {
        title: "Closed-loop velocity response",
        caption: "Airspeed shows a large transient followed by recovery.",
        src: "/assets/f18/closedloop/V.png",
        type: "image",
      },
      {
        title: "Closed-loop altitude response",
        caption: "Altitude exhibits a strong excursion before damping back.",
        src: "/assets/f18/closedloop/Altitude.png",
        type: "image",
      },
      {
        title: "Closed-loop angle response",
        caption: "Angle variables show transient motion followed by bounded recovery.",
        src: "/assets/f18/closedloop/A_B_G.png",
        type: "image",
      },
      {
        title: "Closed-loop control inputs",
        caption: "Control effort spikes during correction and then returns near trim.",
        src: "/assets/f18/closedloop/control_inputs.png",
        type: "image",
      },
    ],
    openLoopAssets: [
      {
        title: "Open-loop composite response",
        caption: "Persistent oscillatory behavior without regulation.",
        src: "/assets/f18/openloop/DUresponse2_5by21.png",
        type: "image",
      },
      {
        title: "Open-loop long-horizon response",
        caption: "Long-horizon traces reinforce unregulated oscillatory motion.",
        src: "/assets/f18/openloop/complete1000.png",
        type: "image",
      },
    ],
  },
  spirob: {
    id: "spirob",
    title: "SpiRob Cable-Driven Soft Robot",
    badge: ["Flagship robotics case study", "Embedded actuation", "Soft robotics"],
    intro:
      "Built a spinal-inspired cable-driven robot around embedded actuation, modular motion control, and simulation-backed structure development. The page is designed to show real hardware evidence first, then connect that hardware to actuation logic and simulation work.",
    heroMedia: {
      title: "Prototype hardware overview",
      caption:
        "The top still proves the project is a real built system: printed body, assembled structure, and enough physical maturity to anchor the whole case study.",
      src: "/assets/spirob/441898761-9bb93bcb-c744-4a6c-aa65-d33fd86fd921.jpg",
      type: "image",
    },
    motionMedia: {
      title: "Wave-motion demo",
      caption:
        "Us demoing the wave-like motion — printed on a well-seasoned Sovol 3D that's been through more failed first layers than I care to count. Not everyone starts with a P1S. Some of us built character segment by segment.",
      src: "/assets/spirob/IMG_1222.MOV",
      poster: "/assets/spirob/441898761-9bb93bcb-c744-4a6c-aa65-d33fd86fd921.jpg",
      mimeType: "video/quicktime",
      type: "video",
    },
    graspingMedia: {
      title: "Grasping behavior demo",
      caption:
        "The robot demonstrating grasping — the kind of thing that takes about fifty percent engineering and fifty percent begging a worn-out 3D printer to produce something structurally usable. The Sovol has opinions. We negotiated.",
      src: "/assets/spirob/IMG_1355.mov",
      poster: "/assets/spirob/441898761-9bb93bcb-c744-4a6c-aa65-d33fd86fd921.jpg",
      mimeType: "video/quicktime",
      type: "video",
    },
    metrics: [
      "Cable-driven soft robot architecture",
      "Arduino plus stepper-motor embedded control",
      "Wave-based motion generation",
      "Simulation-to-hardware development workflow",
    ],
    story: [
      {
        title: "Concept",
        body:
          "A spinal-inspired, cable-driven robot designed to create bending and wave-like motion through differential cable actuation.",
      },
      {
        title: "Hardware reality",
        body:
          "This is not just a CAD idea. There is a real printed body, real motors, real wiring, and a bench setup that exposes the practical integration work. Every segment was printed on a Sovol 3D that had clearly seen better days — which is to say, not everyone starts on a Bambu P1S. Some of us earn our first layers.",
      },
      {
        title: "Systems value",
        body:
          "The project combines mechanism design, actuation, embedded control logic, debugging, and a path into simulation, which is what makes it interesting beyond the build itself.",
      },
    ],
    whyItMatters: [
      "Shows engineering ownership across mechanism concept, electronics, embedded behavior, and presentation.",
      "Demonstrates the move from physical prototyping into more principled modeling instead of stopping at a hardware demo.",
      "Signals strong fit for robotics, embedded, mechatronics, and early-stage R&D engineering roles.",
    ],
    implementation: [
      {
        title: "Robot architecture",
        body:
          "Developed a spinal-inspired cable-driven robot concept built around modular body segments, central structural support, and differential cable pulling to generate bending and wave-like motion.",
      },
      {
        title: "Embedded actuation",
        body:
          "Implemented actuation logic using Arduino-compatible control, ULN2003 drivers, and 28BYJ-48 stepper motors, with an emphasis on modular non-blocking behavior rather than delay-heavy scripts.",
      },
      {
        title: "Motion-control logic",
        body:
          "Structured the controller around sinusoidal and time-based cable actuation to produce left and right waves, differential tension behavior, and held deformation states for repeatable motion experiments.",
      },
      {
        title: "Simulation and modeling path",
        body:
          "Extended the project into simulation using MuJoCo and MJCF-style modeling, building segment-by-segment understanding of geometry, joints, cable-driven deformation, and expected physical behavior.",
      },
    ],
    challenges: [
      "Turning a soft-robot concept into a controllable embedded mechatronic system",
      "Managing cable actuation timing, directionality, and repeatability with low-cost hardware",
      "Bridging physical prototyping with simulation and future learning-based control ideas",
      "Presenting an experimental robotics project as an engineering case study rather than a hobby build",
    ],
    supportingAssets: [
      {
        title: "Electronics and actuation bench setup",
        caption:
          "The bench view carries the embedded-control story: Arduino logic, breadboard integration, driver wiring, and the debugging reality required to make actuation repeatable.",
        src: "/assets/spirob/441897915-053f7348-bbb1-4e4f-949f-b7c14ebd4cb8.jpg",
        type: "image",
      },
      {
        title: "Printed body and segment detail",
        caption:
          "The close hardware view supports the mechanism story, showing the printed segment geometry and physical structure that make cable-driven deformation plausible.",
        src: "/assets/spirob/441898208-e35ee814-b298-4bb8-a3fc-6146c4e591f1.jpg",
        type: "image",
      },
    ],
    futureDirections: [
      "MuJoCo renders that connect the physical robot to a more formal model representation",
      "Annotated mechanism diagrams showing cable pull directions and segment behavior",
      "Richer motion-control experiments with more repeatable wave behaviors",
      "Longer-term autonomy, learned control, catching, and manipulation directions framed as future work",
    ],
    simulationStatus:
      "Simulation files are already part of the project record. The current gap is exported visual output, not the absence of serious modeling intent.",
    simulationFiles: ["public/assets/spirob/spirobs.xml", "public/assets/spirob/Spirobs1.xml"],
  },
  slam: {
    id: "slam",
    title: "Stereo SLAM for UAV Workflows",
    badge: ["Perception case study", "SLAM", "Trajectory visualization"],
    intro:
      "Built out SLAM-oriented experimentation focused on making spatial estimation outputs legible and reviewable. The project is valuable because it adds perception depth to the portfolio through reconstruction views, pose visualization, and workflow-oriented interpretation rather than vague claims about autonomy.",
    repoUrl: "https://github.com/WeffreyJ/SLAM",
    heroMedia: {
      title: "SLAM reconstruction view",
      caption:
        "The primary proof image shows a reconstructed environment and estimation output, giving the page an immediate perception and navigation identity.",
      src: "/assets/slam/SLAM.png",
      type: "image",
    },
    motionMedia: {
      title: "Workflow video capture",
      caption:
        "Short video proof that helps make the SLAM workflow feel active and reviewable rather than only represented by still images.",
      src: "/assets/slam/IMG_2123.mov",
      poster: "/assets/slam/SLAM.png",
      mimeType: "video/quicktime",
      type: "video",
    },
    metrics: [
      "Stereo SLAM workflow",
      "Pose and trajectory inspection",
      "Perception output review and debugging",
      "UAV-oriented navigation context",
    ],
    pipeline: [
      {
        title: "Record and structure the data",
        body:
          "The repository is organized around recording stereo frames plus ground-truth into KITTI-style sequences so the downstream SLAM workflow has a repeatable, evaluation-friendly input format.",
      },
      {
        title: "Run the SLAM engine",
        body:
          "The current project is set up to run a SLAM engine in a modular way, with the present workflow supporting a mock engine now and future integration of pySLAM or ORB-SLAM3 later.",
      },
      {
        title: "Evaluate the trajectory",
        body:
          "Outputs are intended to be reviewed with alignment, absolute trajectory error, and simple plots so the navigation behavior can be interpreted instead of accepted blindly.",
      },
    ],
    story: [
      {
        title: "Why this project matters",
        body:
          "This page gives the portfolio a perception-side project that complements the controls and robotics work. It shows the ability to work with estimation outputs, scene understanding, and navigation-oriented debugging instead of only controller behavior.",
      },
      {
        title: "What the images prove",
        body:
          "The current image set is enough to show that the work involved more than abstract code. There is a visible SLAM reconstruction view and a pose-viewer style interface that support interpretation and evaluation.",
      },
      {
        title: "How to read it",
        body:
          "The page should read as workflow-heavy engineering work: run the system, inspect the outputs, understand the trajectory, and determine whether the result is stable and meaningful enough for robotics use.",
      },
    ],
    architectureNotes: [
      "Repository includes configs, tests, tools, and a dedicated `uav_slam` package",
      "CLI-oriented workflow under `uav_slam/scripts` for running and evaluating the pipeline",
      "Designed to be Flightmare-ready rather than a disconnected toy setup",
      "Evaluation mindset built around alignment, ATE, and simple plots",
    ],
    implementation: [
      {
        title: "Perception workflow",
        body:
          "Structured the project around SLAM-oriented experimentation where the outputs themselves needed to be inspectable, not just numerically generated. That meant paying attention to reconstruction views, pose traces, and the overall readability of the estimation pipeline.",
      },
      {
        title: "Trajectory and pose review",
        body:
          "Used pose-viewer style output to inspect estimated motion and make the navigation behavior easier to reason about during evaluation and debugging.",
      },
      {
        title: "UAV relevance",
        body:
          "The project is framed around UAV-oriented workflows, which makes the work useful as a perception and navigation complement to the controls-heavy parts of the portfolio.",
      },
    ],
    valuePoints: [
      "Adds a real perception and navigation dimension to the portfolio",
      "Shows comfort with visual debugging and output interpretation rather than only controller metrics",
      "Strengthens fit for robotics, autonomy, perception, and integrated systems roles",
    ],
    assets: [
      {
        title: "SLAM reconstruction output",
        caption:
          "Primary scene and map-style output used to make the estimation result visible rather than purely internal.",
        src: "/assets/slam/SLAM.png",
        type: "image",
      },
      {
        title: "Pose viewer and trajectory inspection",
        caption:
          "Viewer-style output that supports debugging and interpretation of estimated motion through a more readable pose and path view.",
        src: "/assets/slam/Untitled.png",
        type: "image",
      },
    ],
    nextSteps: [
      "Add a concise pipeline diagram showing stereo input, SLAM backend, and output visualization",
      "Include one short paragraph on failure modes, drift, or what was hardest to validate",
      "Add one role-specific takeaway tying the work to autonomy and navigation engineering jobs",
    ],
  },
  sensorfusion: {
    id: "sensorfusion",
    title: "Sensor Fusion Navigation",
    intro:
      "EKF-based state-estimation work centered on fusing IMU and GPS signals into a more stable navigation picture under noisy measurements and intermittent dropout. This project fits the portfolio as a systems-oriented estimation study linking controls, autonomy, and navigation.",
  },
  vision: {
    id: "vision",
    title: "Vision Safety Monitoring System",
    intro:
      "Built a single-window computer-vision pipeline for interactive no-go zones, posture labels, and entry or exit alerts. This page is strongest when treated as a system-design and workflow page rather than a media-heavy gallery: what the pipeline does, how the operator interacts with it, and how alerts are generated and stored.",
    repoUrl: "https://github.com/WeffreyJ/VisionSetup",
    badge: ["Computer vision case study", "OpenCV pipeline", "Safety monitoring"],
    metrics: [
      "Interactive zone definition",
      "Posture labeling and monitoring HUD",
      "Entry and exit alert generation",
      "CLI-driven live or file-based execution",
    ],
    story: [
      {
        title: "What the system does",
        body:
          "The project is a minimal OpenCV-based monitoring pipeline built to define no-go zones, watch activity inside the scene, label posture, and trigger entry or exit alerts when configured regions are crossed.",
      },
      {
        title: "Why it matters",
        body:
          "This is useful portfolio work because it shows applied computer vision as an engineered monitoring workflow rather than just model inference in isolation. The emphasis is on operating behavior, interaction, and useful outputs.",
      },
      {
        title: "How to read the page",
        body:
          "The page should be understood as a system page: operator inputs, runtime pipeline behavior, event handling, and logged outputs. The architecture is the important proof, with the repo serving as direct technical evidence.",
      },
    ],
    pipeline: [
      {
        title: "Input and runtime modes",
        body:
          "The repository supports live webcam execution or video-file playback through a CLI entrypoint, which makes the monitoring workflow testable in both interactive and offline scenarios.",
      },
      {
        title: "Interactive scene setup",
        body:
          "The user can enter draw mode, click polygon points, and save normalized zones directly from the interface. That interactive setup is a central part of the system instead of an afterthought.",
      },
      {
        title: "Alerting and artifacts",
        body:
          "When entry events occur, alerts are appended to a JSONL log and thumbnails are written out, which turns the pipeline from a visual demo into something closer to a traceable monitoring tool.",
      },
    ],
    architectureNotes: [
      "Repository organized around configs, scripts, tests, and a `src/vision` package",
      "CLI entrypoint supports `vision live --config ... --source ...` for runtime execution",
      "Interactive controls include draw mode, polygon saving, HUD toggle, and zone clearing",
      "Alert events append to `logs/alerts.jsonl` and thumbnails are written to `media/thumbs`",
    ],
    implementation: [
      {
        title: "Monitoring pipeline",
        body:
          "The project combines OpenCV-based video handling with application logic for operator-defined zones, activity interpretation, and alert generation in a single runtime flow.",
      },
      {
        title: "Human-in-the-loop interaction",
        body:
          "A key part of the design is that the operator can define and update zones directly in the interface rather than being forced to hardcode scene logic ahead of time.",
      },
      {
        title: "Operational outputs",
        body:
          "Alerts, thumbnails, and runtime HUD behavior make the system easier to inspect, validate, and adapt for safety-monitoring scenarios rather than leaving the output as raw frames only.",
      },
    ],
    valuePoints: [
      "Adds a direct computer-vision and monitoring-system page to the portfolio",
      "Shows applied runtime tooling and event handling, not only model usage",
      "Strengthens fit for perception, safety, monitoring, and real-world automation workflows",
    ],
    outputArtifacts: [
      "Interactive no-go-zone polygons",
      "Posture labels in the main monitoring window",
      "Entry and exit alert events",
      "JSONL alert logs and saved thumbnails",
    ],
    nextSteps: [
      "Add one short runtime screenshot or clip if you want the page to carry more immediate visual proof",
      "Document the posture-labeling logic and any model or heuristic choices more explicitly",
      "Add one short section on false positives, tuning, or how the monitoring logic was validated",
    ],
  },
};
