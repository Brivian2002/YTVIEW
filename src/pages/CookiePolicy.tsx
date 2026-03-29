import { Card, CardContent } from '@/components/ui/card';

export default function CookiePolicy() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device 
                when you visit a website. They are widely used to make websites work more efficiently 
                and provide information to the website owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Cookies</h2>
              <p className="text-muted-foreground">
                Ytubeview uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are necessary for the website 
                  to function properly. They enable core functionality such as security, network 
                  management, and account access.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> These cookies remember your settings and 
                  preferences, such as language selection and theme preferences.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> These cookies help us understand how visitors 
                  interact with our website by collecting and reporting information anonymously.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> These cookies are used to track visitors across 
                  websites to display relevant advertisements.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Types of Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie Name</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 font-mono">session_id</td>
                      <td>Authentication and session management</td>
                      <td>Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono">theme</td>
                      <td>Store user theme preference</td>
                      <td>1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono">_ga</td>
                      <td>Google Analytics - distinguish users</td>
                      <td>2 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono">_gid</td>
                      <td>Google Analytics - distinguish users</td>
                      <td>24 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">cookie_consent</td>
                      <td>Store cookie consent preference</td>
                      <td>1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                We may use third-party services that place cookies on your device. These include:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>
                  <strong>Google Analytics:</strong> We use Google Analytics to understand how 
                  visitors interact with our website. Google Analytics cookies collect information 
                  in an anonymous form.
                </li>
                <li>
                  <strong>Payment Processors:</strong> When you make a payment, our payment 
                  processors may use cookies to process your transaction securely.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Managing Cookies</h2>
              <p className="text-muted-foreground">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>View cookies that are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from particular websites</li>
                <li>Block all cookies from being set</li>
                <li>Block third-party cookies while allowing first-party cookies</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Please note that disabling cookies may affect the functionality of our website. 
                Essential cookies cannot be disabled as they are required for the website to work.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or for other operational, legal, or regulatory reasons. We encourage 
                you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at 
                privacy@ytubeview.com.
              </p>
            </section>

            <p className="text-sm text-muted-foreground pt-4 border-t">
              Last updated: March 2024
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
