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
    const { t } = useTranslation("projects");
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
        <Card className="relative p-0 gap-0 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border-primary/10 hover:border-primary/30 bg-card/60 backdrop-blur-sm">
            
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

                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md shadow-sm">
                        <Layers size={14} className="text-primary" /> {project.type}
                    </Badge>
                    {project.modrinthId && version && (
                        <Badge variant="secondary" className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md shadow-sm">
                            <Layers2 size={14} className="text-primary" /> v{version}
                        </Badge>
                    )}
                </div>

                {project.badge && project.badge.length > 0 && (
                    <div className="absolute top-0 right-0 z-20">
                        <Badge className="rounded-none rounded-bl-xl shadow-md uppercase tracking-wider font-bold px-3 py-1 bg-primary text-primary-foreground">
                            {t(`badge.${project.badge}`, project.badge)}
                        </Badge>
                    </div>
                )}
                
                <div className="absolute -bottom-8 left-4 z-20">
                    <div className="rounded-xl bg-background p-1.5 shadow-xl border border-border group-hover:scale-105 transition-transform duration-300">
                        <img
                            src={project.logo}
                            alt={project.name}
                            className="w-16 h-16 rounded-lg object-cover bg-muted"
                        />
                    </div>
                </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-5 pt-12">
                
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground drop-shadow-sm group-hover:text-primary transition-colors leading-tight">
                            {project.name}
                        </h2>
                        {project.subname && (
                            <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mt-0.5">
                                {project.subname}
                            </h4>
                        )}
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            by <span className="text-foreground font-medium ml-1">{project.creator}</span>
                        </p>
                    </div>
                    
                    {project.language && project.language.length > 0 && (
                        <div className="flex -space-x-1" title="Supported Languages">
                            {project.language.map((lang, idx) => (
                                <span key={idx} className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-background shadow-sm text-sm z-10 hover:z-20 hover:scale-110 transition-all cursor-default">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
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
                        <Button variant="secondary" size="sm" className="h-9 gap-1.5 bg-[#00AF5C]/10 text-[#00AF5C] hover:bg-[#00AF5C]/20 border border-[#00AF5C]/20 shadow-none" asChild>
                            <a href={links?.modrinth} target="_blank" rel="noopener noreferrer">
                                <SiModrinth size={16} /> Modrinth
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.curseforge) && (
                        <Button variant="secondary" size="sm" className="h-9 gap-1.5 bg-[#F16436]/10 text-[#F16436] hover:bg-[#F16436]/20 border border-[#F16436]/20 shadow-none" asChild>
                            <a href={links?.curseforge} target="_blank" rel="noopener noreferrer">
                                <SiCurseforge size={16} /> CurseForge
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.github) && (
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 shadow-none" asChild>
                            <a href={links?.github} target="_blank" rel="noopener noreferrer">
                                <SiGithub size={16} /> GitHub
                            </a>
                        </Button>
                    )}
                    {isValidLink(links?.discord) && (
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-[#5865F2] hover:text-[#5865F2] hover:bg-[#5865F2]/10 border border-border shadow-none" asChild>
                            <a href={links?.discord} target="_blank" rel="noopener noreferrer">
                                <SiDiscord size={16} /> Discord
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;
