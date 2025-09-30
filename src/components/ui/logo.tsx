import React from 'react';
import { Linkedin, Zap } from 'lucide-react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon avec effet de vitesse */}
      <div className="relative">
        <div className="relative z-10 p-2 bg-gradient-primary rounded-sm shadow-glow">
          <Linkedin className="h-6 w-6 text-white" />
        </div>
        {/* Effet de vitesse */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-2 flex gap-1 opacity-60">
          <div className="w-3 h-0.5 bg-primary rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-0.5 bg-primary/70 rounded-full animate-pulse delay-200"></div>
          <div className="w-1 h-0.5 bg-primary/50 rounded-full animate-pulse delay-300"></div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-primary rounded-sm blur-md opacity-30 animate-pulse"></div>
      </div>
      
      {/* Texte du logo */}
      {!collapsed && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-tech-purple bg-clip-text text-transparent">
            LinkedIn
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-muted-foreground">Accelerator</span>
            <Zap className="h-3 w-3 text-primary animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}