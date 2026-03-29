import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarStore, useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Play,
  LayoutDashboard,
  Users,
  Video,
  Image,
  Search,
  FileText,
  TrendingUp,
  DollarSign,
  Settings,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  plan?: 'free' | 'pro' | 'premium';
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Channel Analyzer', href: '/channel-analyzer', icon: Users },
  { label: 'Video Analyzer', href: '/video-analyzer', icon: Video },
  { label: 'Trending', href: '/trending', icon: TrendingUp },
];

const toolsNavItems: NavItem[] = [
  { label: 'Thumbnail Lab', href: '/thumbnail-lab', icon: Image, plan: 'pro' },
  { label: 'SEO Studio', href: '/seo-studio', icon: Search, plan: 'pro' },
  { label: 'Transcript Lab', href: '/transcript-lab', icon: FileText, plan: 'pro' },
  { label: 'Revenue Tools', href: '/revenue-tools', icon: DollarSign, plan: 'pro' },
];

const settingsNavItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Billing', href: '/billing', icon: CreditCard },
];

export default function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const plan = user?.plan || 'free';

  const isActive = (href: string) => location.pathname === href;

  const canAccess = (itemPlan?: string) => {
    if (!itemPlan || itemPlan === 'free') return true;
    if (itemPlan === 'pro') return plan === 'pro' || plan === 'premium';
    if (itemPlan === 'premium') return plan === 'premium';
    return false;
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const hasAccess = canAccess(item.plan);

    const content = (
      <Link
        to={hasAccess ? item.href : '/pricing'}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          !hasAccess && "opacity-60"
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
            {!hasAccess && (
              <Badge variant="outline" className="text-xs">
                Pro
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {!hasAccess && <Badge variant="outline" className="text-xs">Pro</Badge>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              {!isCollapsed && <span className="text-xl font-bold">Ytubeview</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4 px-3 space-y-6">
            {/* Main */}
            <nav className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Main
                </p>
              )}
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            {/* Tools */}
            <nav className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tools
                </p>
              )}
              {toolsNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            {/* Settings */}
            <nav className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Account
                </p>
              )}
              {settingsNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
              {plan === 'premium' && (
                <NavLink 
                  item={{ 
                    label: 'Admin', 
                    href: '/admin', 
                    icon: Shield,
                    plan: 'premium'
                  }} 
                />
              )}
            </nav>
          </div>

          {/* User */}
          <div className="border-t p-3">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{plan} Plan</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="w-full h-10"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
