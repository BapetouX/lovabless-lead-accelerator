import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  PenTool, 
  Users, 
  Magnet,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ChevronDown,
  ChevronRight as ChevronRightSmall,
  Eye,
  List,
  FileText,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  {
    name: "Création de contenu",
    icon: PenTool,
    isSection: true,
    children: [
      { name: "Création de posts", href: "/content", icon: FileText },
      { name: "Liste des posts", href: "/posts", icon: List },
    ]
  },
  {
    name: "Veille de contenu",
    icon: Eye,
    isSection: true,
    children: [
      { name: "Posts concurrents", href: "/content-watch", icon: TrendingUp },
      { name: "Liste concurrents", href: "/competitors", icon: Users },
    ]
  },
  {
    name: "Leads",
    icon: UserCheck,
    isSection: true,
    children: [
      { name: "Liste des leads", href: "/leads", icon: List },
      { name: "Leads Magnet", href: "/lead-magnet", icon: Magnet },
    ]
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Création de contenu', 'Veille de contenu', 'Leads']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-card border-r border-border flex flex-col h-screen transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-sm hover:bg-secondary transition-all duration-300 hover:shadow-glow ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.isSection ? (
              <div>
                {/* Section Header */}
                <button
                  onClick={() => !collapsed && toggleSection(item.name)}
                  className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {expandedSections.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRightSmall className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
                
                {/* Section Children */}
                {!collapsed && expandedSections.includes(item.name) && item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-soft'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`
                        }
                      >
                        <child.icon className="h-4 w-4 mr-3" />
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>LinkedIn Accelerator</span>
            <span className="text-primary">v1.0</span>
          </div>
        </div>
      )}
    </div>
  );
}