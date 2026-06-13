import { useEffect, useState } from "react";
import { ProjectCard, type ProjectProps } from "@components/community/ProjectCard";
import { Badge } from "@ui/badge";
import { PageTitle } from "@components/layour/title";
import { Ripple } from "@components/ripple";

export function CommunityPage() {
    const [projects, setProjects] = useState<ProjectProps["project"][]>([]);

    useEffect(() => {
        fetch("/assets/data/projects.json")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Failed to load projects", err));
    }, []);

    return (
        <div className="relative flex flex-col page-container pb-24">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle
                title="COMMUNITY PROJECTS"
                description="Discover amazing projects created by the Minebox community, including Mods, Resource Packs, and more."
            />

            <div className="w-full max-w-6xl mx-auto px-4 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
                {projects.length === 0 && (
                    <div className="w-full text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
                        <Ripple className="size-16 text-primary" />
                        <p>Loading projects...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommunityPage;
