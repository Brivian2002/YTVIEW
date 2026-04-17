import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useThemeStore } from '@/stores';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Zap,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const notifications = [
  {
    id: '1',
    title: 'New viral video detected',
    message: 'A video in your watchlist is trending',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    title: 'Weekly report ready',
    message: 'Your analytics report is available',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Subscription renewed',
    message: 'Your Pro plan has been renewed',
    time: '1 day ago',
    read: true,
  },
];

export default function DashboardHeader() {
  const { user, canSearch } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const plan = user?.plan || 'free';
  const dailySearches = user?.dailySearches || 0;
  const searchLimit = plan === 'premium' ? 200 : plan === 'pro' ? 50 : 5;
  const remainingSearches = searchLimit - dailySearches;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !canSearch()) return;

    setIsSearching(true);
    // Simulate search - in real app, this would navigate to results
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSearching(false);
    setSearchQuery('');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between gap-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search channels, videos, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-24"
            disabled={!canSearch()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant="secondary" className="text-xs">
                {remainingSearches}/{searchLimit}
              </Badge>
            )}
          </div>
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Plan Badge */}
        <Badge 
          variant={plan === 'premium' ? 'default' : plan === 'pro' ? 'secondary' : 'outline'}
          className="hidden sm:flex items-center gap-1"
        >
          <Zap className="w-3 h-3" />
          <span className="capitalize">{plan}</span>
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7744791430316817"
     crossorigin="anonymous"></script>

        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="font-semibold">Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto py-1 px-2">
                Mark all read
              </Button>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 cursor-pointer",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
