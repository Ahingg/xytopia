// src/components/PortfolioView.tsx
interface PortfolioViewProps {
    onBackToGame: () => void;
}

export const PortfolioView = ({ onBackToGame }: PortfolioViewProps) => {
    return (
        <div className="w-full h-full bg-gradient-to-br from-portfolio-dark to-portfolio-darker text-white overflow-y-auto">
            {/* Header */}
            <header className="relative p-6 border-b border-portfolio-accent/20">
                <button
                    onClick={onBackToGame}
                    className="absolute top-6 left-6 px-4 py-2 bg-growtopia-blue text-white rounded-md hover:bg-growtopia-dark-blue transition-colors duration-200 font-modern font-medium"
                >
                    Back to Game
                </button>
                <div className="text-center">
                    <h1 className="text-4xl font-bold font-modern mb-2 text-portfolio-light">
                        My Portfolio
                    </h1>
                    <p className="text-lg text-gray-300 font-modern">
                        Interactive Developer Experience
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-4xl mx-auto">
                {/* Hero Section */}
                <section className="mb-12 text-center">
                    <div className="relative">
                        <h2 className="text-3xl font-bold mb-4 text-portfolio-light font-modern">
                            Welcome to My Interactive Portfolio
                        </h2>
                        <p className="text-lg text-gray-300 mb-6 font-modern leading-relaxed">
                            This portfolio combines my love for game development
                            and web technologies, inspired by Growtopia's
                            creative world-building mechanics.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <span className="px-3 py-1 bg-growtopia-blue rounded-full text-sm font-medium">
                                React
                            </span>
                            <span className="px-3 py-1 bg-growtopia-green rounded-full text-sm font-medium">
                                Phaser 3
                            </span>
                            <span className="px-3 py-1 bg-portfolio-accent rounded-full text-sm font-medium">
                                TypeScript
                            </span>
                            <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-medium">
                                Tailwind CSS
                            </span>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-portfolio-light font-modern">
                        Technical Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkillCard
                            title="Frontend Development"
                            skills={[
                                "React",
                                "TypeScript",
                                "Next.js",
                                "Tailwind CSS",
                                "Framer Motion",
                            ]}
                            color="growtopia-blue"
                        />
                        <SkillCard
                            title="Game Development"
                            skills={[
                                "Phaser 3",
                                "Unity",
                                "C#",
                                "Game Design",
                                "Pixel Art",
                            ]}
                            color="growtopia-green"
                        />
                        <SkillCard
                            title="Backend & Tools"
                            skills={[
                                "Node.js",
                                "Express",
                                "MongoDB",
                                "Git",
                                "Docker",
                            ]}
                            color="portfolio-accent"
                        />
                    </div>
                </section>

                {/* Projects Section */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 text-portfolio-light font-modern">
                        Featured Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProjectCard
                            title="Xytopia Portfolio"
                            description="An interactive portfolio inspired by Growtopia, built with React and Phaser 3."
                            technologies={[
                                "React",
                                "Phaser 3",
                                "TypeScript",
                                "Tailwind",
                            ]}
                            status="Current Project"
                        />
                        <ProjectCard
                            title="Game Project Showcase"
                            description="Collection of game development projects and interactive experiences."
                            technologies={["Unity", "C#", "Game Design"]}
                            status="In Development"
                        />
                    </div>
                </section>

                {/* Contact Section */}
                <section className="text-center">
                    <h3 className="text-2xl font-bold mb-6 text-portfolio-light font-modern">
                        Get In Touch
                    </h3>
                    <p className="text-gray-300 mb-6 font-modern">
                        Interested in collaboration or have questions about my
                        work?
                    </p>
                    <div className="flex justify-center space-x-4">
                        <ContactButton href="#" platform="GitHub" />
                        <ContactButton href="#" platform="LinkedIn" />
                        <ContactButton href="#" platform="Email" />
                    </div>
                </section>
            </main>
        </div>
    );
};

const SkillCard = ({
    title,
    skills,
    color,
}: {
    title: string;
    skills: string[];
    color: string;
}) => (
    <div className="bg-portfolio-darker/50 rounded-lg p-6 border border-portfolio-accent/20 hover:border-portfolio-accent/40 transition-colors duration-200">
        <h4 className={`text-lg font-bold mb-3 text-${color} font-modern`}>
            {title}
        </h4>
        <div className="space-y-2">
            {skills.map((skill, index) => (
                <div key={index} className="text-gray-300 font-modern text-sm">
                    {skill}
                </div>
            ))}
        </div>
    </div>
);

const ProjectCard = ({
    title,
    description,
    technologies,
    status,
}: {
    title: string;
    description: string;
    technologies: string[];
    status: string;
}) => (
    <div className="bg-portfolio-darker/50 rounded-lg p-6 border border-portfolio-accent/20 hover:border-portfolio-accent/40 transition-colors duration-200">
        <div className="flex justify-between items-start mb-3">
            <h4 className="text-lg font-bold text-portfolio-light font-modern">
                {title}
            </h4>
            <span className="px-2 py-1 bg-growtopia-blue text-xs rounded-full">
                {status}
            </span>
        </div>
        <p className="text-gray-300 mb-4 font-modern text-sm leading-relaxed">
            {description}
        </p>
        <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
                <span
                    key={index}
                    className="px-2 py-1 bg-portfolio-accent/20 text-xs rounded text-gray-300"
                >
                    {tech}
                </span>
            ))}
        </div>
    </div>
);

const ContactButton = ({
    href,
    platform,
}: {
    href: string;
    platform: string;
}) => (
    <a
        href={href}
        className="px-6 py-2 bg-portfolio-accent hover:bg-portfolio-light text-white rounded-md transition-colors duration-200 font-modern font-medium"
    >
        {platform}
    </a>
);
