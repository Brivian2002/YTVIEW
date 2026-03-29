import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  DollarSign,
  Calculator,
  TrendingUp,
  Globe,
  Info,
  Copy,
  Check,
} from 'lucide-react';

const CPM_RANGES: Record<string, { min: number; max: number }> = {
  US: { min: 4, max: 12 },
  GB: { min: 3, max: 8 },
  CA: { min: 3, max: 9 },
  AU: { min: 3, max: 8 },
  DE: { min: 2, max: 6 },
  FR: { min: 2, max: 5 },
  IN: { min: 0.5, max: 2 },
  BR: { min: 1, max: 3 },
  JP: { min: 2, max: 5 },
  OTHER: { min: 1, max: 4 },
};

const NICHE_MULTIPLIERS: Record<string, number> = {
  finance: 1.5,
  tech: 1.3,
  business: 1.4,
  gaming: 0.8,
  entertainment: 0.7,
  education: 1.0,
  lifestyle: 0.9,
  health: 1.2,
  travel: 0.8,
  food: 0.9,
};

export default function RevenueTools() {
  const [views, setViews] = useState('');
  const [cpm, setCpm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedNiche, setSelectedNiche] = useState('tech');
  const [estimatedRevenue, setEstimatedRevenue] = useState<{ min: number; max: number } | null>(null);
  const [rpmResult, setRpmResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateRevenue = () => {
    const viewCount = parseInt(views);
    const cpmValue = parseFloat(cpm);

    if (!viewCount || viewCount <= 0) {
      toast.error('Please enter valid view count');
      return;
    }

    const countryRange = CPM_RANGES[selectedCountry] || CPM_RANGES.OTHER;
    const nicheMultiplier = NICHE_MULTIPLIERS[selectedNiche] || 1;

    let minCPM = cpmValue || countryRange.min;
    let maxCPM = cpmValue || countryRange.max;

    minCPM *= nicheMultiplier;
    maxCPM *= nicheMultiplier;

    const minRevenue = (viewCount / 1000) * minCPM;
    const maxRevenue = (viewCount / 1000) * maxCPM;

    setEstimatedRevenue({ min: minRevenue, max: maxRevenue });
    setRpmResult((minCPM + maxCPM) / 2);
  };

  const copyResult = () => {
    if (estimatedRevenue) {
      const text = `Estimated Revenue: ${formatCurrency(estimatedRevenue.min)} - ${formatCurrency(estimatedRevenue.max)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Revenue Tools</h1>
        <p className="text-muted-foreground">
          Estimate your YouTube earnings with RPM and CPM calculators.
        </p>
      </div>

      <Tabs defaultValue="estimator" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-3 w-full">
          <TabsTrigger value="estimator">Earnings Estimator</TabsTrigger>
          <TabsTrigger value="rpm">RPM Calculator</TabsTrigger>
          <TabsTrigger value="cpm">CPM by Country</TabsTrigger>
        </TabsList>

        {/* Earnings Estimator */}
        <TabsContent value="estimator" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculate Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Monthly Views</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 100000"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPM (optional - leave blank for auto-estimate)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 5.00"
                    value={cpm}
                    onChange={(e) => setCpm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {Object.keys(CPM_RANGES).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Niche</Label>
                    <select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {Object.keys(NICHE_MULTIPLIERS).map((niche) => (
                        <option key={niche} value={niche}>
                          {niche.charAt(0).toUpperCase() + niche.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button onClick={calculateRevenue} className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Calculate
                </Button>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-600 text-sm">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    These are estimates only. Actual earnings depend on many factors 
                    including ad types, viewer engagement, and advertiser demand.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estimated Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {estimatedRevenue ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Monthly Estimate</p>
                      <p className="text-4xl font-bold text-green-500">
                        {formatCurrency(estimatedRevenue.min)} - {formatCurrency(estimatedRevenue.max)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Estimated RPM</span>
                        <span className="font-medium">${rpmResult?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Views</span>
                        <span className="font-medium">{formatNumber(parseInt(views))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Country</span>
                        <span className="font-medium">{selectedCountry}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Niche</span>
                        <span className="font-medium capitalize">{selectedNiche}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={copyResult}>
                      {copied ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      Copy Result
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Enter your details to see your estimated revenue
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* RPM Calculator */}
        <TabsContent value="rpm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RPM Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Revenue ($)</Label>
                  <Input type="number" placeholder="e.g., 1000" />
                </div>
                <div className="space-y-2">
                  <Label>Total Views</Label>
                  <Input type="number" placeholder="e.g., 100000" />
                </div>
              </div>
              <Button className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate RPM
              </Button>
              <div className="p-6 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground mb-2">Your RPM</p>
                <p className="text-3xl font-bold">$0.00</p>
                <p className="text-sm text-muted-foreground mt-2">
                  per 1,000 views
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CPM by Country */}
        <TabsContent value="cpm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Average CPM by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(CPM_RANGES).map(([country, range]) => (
                  <div
                    key={country}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">{country}</span>
                      </div>
                      <span className="font-medium">{country}</span>
                    </div>
                    <Badge variant="secondary">
                      ${range.min} - ${range.max}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 text-yellow-600 text-sm">
                <Info className="w-4 h-4 inline mr-2" />
                CPM rates vary based on niche, audience demographics, seasonality, 
                and advertiser demand. These are average estimates.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
