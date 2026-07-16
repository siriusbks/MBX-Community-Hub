import React, { useEffect, useState } from "react";
import { Globe, Layers, Layers2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiModrinth, SiCurseforge, SiGithub, SiDiscord } from "react-icons/si";
import { Card, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";

export interface ProjectProps {
    project: {
        id: string;
        name: string;
        subname?: string;
        description?: string;
        creator: string;
        website?: string;
        logo: string;
        banner?: string;
        type: string;
        badge?: string;
        language?: string[];
        links?: {
            website?: string;
            modrinth?: string;
            curseforge?: string;
            github?: string;
            discord?: string;
        };
        modrinthId?: string;
    };
}

export const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
    const { links } = project;
    const { t } = useTranslation(["projects", "community"]);
    const [version, setVersion] = useState<string | null>(null);
    const [fetchedDescription, setFetchedDescription] = useState<string | null>(null);

    useEffect(() => {
        if (!project.modrinthId) return;
        const fetchData = async () => {
            try {
                if (!project.description) {
                    const resProj = await fetch(`https://api.modrinth.com/v2/project/${project.modrinthId}`);
                    if (resProj.ok) {
                        const dataProj = await resProj.json();
                        setFetchedDescription(dataProj.description);
                    }
                }

                const resVer = await fetch(`https://api.modrinth.com/v2/project/${project.modrinthId}/version`);
                if (resVer.ok) {
                    const dataVer = await resVer.json();
                    if (Array.isArray(dataVer) && dataVer.length > 0) {
                        setVersion(dataVer[0].version_number);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch modrinth data", e);
            }
        };
        fetchData();
    }, [project.modrinthId, project.description]);

    const description = project.description || fetchedDescription || t(`description.${project.id}`, "");
    const isValidLink = (url?: string) => url && url.trim().length > 0;

    return (
        <Card className="minebox-shadow relative p-0 gap-0 overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border-primary/10 hover:border-primary/30  backdrop-blur-sm">
            <div className="relative h-40 w-full bg-muted shrink-0">
                {project.banner ? (
                    <img
                        src={project.banner}
                        alt={`${project.name} Banner`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
                )}

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

                <div className="absolute top-2 left-2 flex flex-col flex-wrap gap-1 z-10">
                    <Badge variant="secondary" className="flex items-center gap-1.5  backdrop-blur-md shadow-sm">
                        <Layers size={14} className="text-primary tracking-wider" /> {project.type}
                    </Badge>
                    {project.modrinthId && version && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                            <Layers2 size={14} className="text-primary" /> v{version}
                        </Badge>
                    )}
                </div>
                <div className="absolute bottom-2 right-2 flex flex-row flex-wrap gap-1 z-10">
                    {project.language && project.language.length > 0 && (
                        <div className="ml-auto flex space-x-2" title="Supported Languages">
                            {project.language.map((lang, idx) => (
                                <span key={idx} className="inline-flex items-center justify-center text-xs z-10 hover:z-20 hover:scale-110 transition-all cursor-default">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    )}
                </div>



                {project.badge && project.badge.length > 0 && (
                    <div className="absolute top-0 right-0 z-20">
                        <Badge className="rounded-none rounded-bl-xl shadow-md uppercase tracking-wider font-bold px-3 py-1 bg-primary text-primary-foreground">
                            {t(`community:badge.${project.badge}`, project.badge)}
                        </Badge>
                    </div>
                )}

                <div className="absolute -bottom-12 left-4 z-20">
                    <div className="w-full   rounded-xl flex flex-row items-end gap-2 ">
                        <img
                            src={project.logo}
                            alt={project.name}
                            className="size-20 rounded-lg object-cover bg-muted group-hover:scale-105 transition-transform duration-300"
                        />

                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h2 className="text-xl  tracking-wide drop-shadow-[0_3px_0_#5d3a00] text-primary transition-colors leading-tight">
                                    {project.name}
                                </h2>
                                {project.subname && (
                                    <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mt-0.5">
                                        {project.subname}
                                    </h4>
                                )}
                                <p className="text-xs text-muted-foreground  flex items-center">
                                    by <span className="text-foreground font-medium ml-1">{project.creator}</span>

                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-5 pt-12">


                <p className="text-xs text-muted-foreground leading-tight mt-3 line-clamp-3 leading-relaxed">
                    {description}
                </p>
                <div className="mt-auto pt-6 flex flex-wrap items-center gap-2">
                    {isValidLink(links?.website) && (
                        <Button variant="default" size="sm" className="h-9 gap-1.5 shadow-sm" asChild>
                            <a href={links?.website} target="_blank" rel="noopener noreferrer">
                                <Globe size={16} /> Website
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.modrinth) && (
                        <Button size="lg" className="" asChild>
                            <a href={links?.modrinth} target="_blank" rel="noopener noreferrer">
                                <SiModrinth className="size-3 mt-0.5" /> Modrinth
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.curseforge) && (
                        <Button size="lg" className="" asChild>
                            <a href={links?.curseforge} target="_blank" rel="noopener noreferrer">
                                <SiCurseforge className="size-3 mt-0.5" /> Curse Forge
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.github) && (
                        <Button variant="secondary" size="lg" className="" asChild>
                            <a href={links?.github} target="_blank" rel="noopener noreferrer">
                                <SiGithub className="size-3 mt-0.5" /> GitHub
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.discord) && (
                        <Button variant="secondary" size="lg" className="" asChild>
                            <a href={links?.discord} target="_blank" rel="noopener noreferrer">
                                <SiDiscord className="size-3 mt-0.5" /> Discord
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;
