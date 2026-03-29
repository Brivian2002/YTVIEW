import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { 
  CreditCard, 
  Zap, 
  Check, 
  ArrowRight,
  Calendar,
  Download,
  AlertCircle,
} from 'lucide-react';

const INVOICES = [
  { id: 'INV-001', date: '2024-03-01', amount: 10, status: 'paid' },
  { id: 'INV-002', date: '2024-02-01', amount: 10, status: 'paid' },
  { id: 'INV-003', date: '2024-01-01', amount: 10, status: 'paid' },
];

export default function Billing() {
  const { user } = useAuthStore();
  const [isCancelling, setIsCancelling] = useState(false);

  const plan = user?.plan || 'free';
  const isPaid = plan !== 'free';

  const handleCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      toast.success('Subscription cancelled. You will have access until the end of your billing period.');
    }, 1500);
  };

  const handleDownload = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                plan === 'premium' ? 'bg-purple-500/10' :
                plan === 'pro' ? 'bg-blue-500/10' : 'bg-gray-500/10'
              }`}>
                <Zap className={`w-6 h-6 ${
                  plan === 'premium' ? 'text-purple-500' :
                  plan === 'pro' ? 'text-blue-500' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <p className="font-semibold capitalize">{plan} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {isPaid ? 'Billed monthly' : 'Free forever'}
                </p>
              </div>
            </div>
            <Badge variant={isPaid ? 'default' : 'secondary'} className="capitalize">
              {plan}
            </Badge>
          </div>

          {isPaid && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Next billing date</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    April 1, 2024
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <CreditCard className="w-4 h-4" />
                    ${plan === 'premium' ? '30.00' : '10.00'}/month
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/pricing">
                    Change Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
                  {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              </div>
            </>
          )}

          {!isPaid && (
            <Button asChild>
              <Link to="/pricing">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      {isPaid && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Manage your payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
            <Button variant="outline" className="mt-4">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoice History */}
      {isPaid && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              Download your past invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {INVOICES.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Update your billing address and tax information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 text-blue-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Need to update your billing info?</p>
              <p className="text-sm">
                Contact our support team to update your billing address or add tax information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
