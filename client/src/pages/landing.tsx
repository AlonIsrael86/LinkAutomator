import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Link2, BarChart3, Webhook, Globe, Zap, Shield, QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// #region agent log
const LOG_ENDPOINT = 'http://127.0.0.1:7243/ingest/58a5141c-77e9-4e25-8e89-e0ca371e4243';
const log = (location: string, message: string, data: any, hypothesisId?: string) => {
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId
    })
  }).catch(() => {});
};
// #endregion agent log

export default function LandingPage() {
  // #region agent log
  useEffect(() => {
    console.log('[DEBUG] LandingPage: Component mounted, URL:', window.location.href);
    const root = document.getElementById('root');
    const clerkElements = document.querySelectorAll('[class*="cl-"], [id*="clerk"], [data-clerk], [class*="clerk"]');
    console.log('[DEBUG] LandingPage: DOM check - root exists:', !!root, 'Clerk elements found:', clerkElements.length);
    if (clerkElements.length > 0) {
      console.log('[DEBUG] LandingPage: Clerk elements detected:', Array.from(clerkElements).map(el => ({
        tag: el.tagName,
        classes: el.className,
        id: el.id
      })));
    }
    log('landing.tsx:25', 'LandingPage component mounted', { 
      windowLocation: window.location.href,
      clerkElementsCount: clerkElements.length 
    }, 'A');
  }, []);
  // #endregion agent log
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Link Automator</span>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                התחברות
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                התחל בחינם
              </Button>
            </SignUpButton>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">הדור הבא של קיצור לינקים</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            קצר. עקוב. צמח.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              בזמן אמת.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            פלטפורמה מתקדמת לקיצור לינקים עם אנליטיקס מעמיק, 
            אוטומציות חכמות, ואינטגרציות מובילות. 
            הכל במקום אחד.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-6">
                התחל בחינם
                <Zap className="w-5 h-5 mr-2" />
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6">
              צפה בדמו
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10M+</div>
              <div className="text-gray-400 mt-1">קליקים במעקב</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50K+</div>
              <div className="text-gray-400 mt-1">לינקים נוצרו</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">99.9%</div>
              <div className="text-gray-400 mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">הכל שאתה צריך לניהול לינקים</h2>
            <p className="text-gray-400 text-lg">כלים מתקדמים שיעזרו לך לעקוב, לנתח ולהגדיל</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">אנליטיקס מתקדם</h3>
              <p className="text-gray-400">מעקב קליקים בזמן אמת עם פילוח לפי מכשיר, מיקום, ודפדפן</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Webhook className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Webhooks חכמים</h3>
              <p className="text-gray-400">אינטגרציה עם Make.com, Zapier ועוד לאוטומציות בלתי מוגבלות</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">דומיין מותאם</h3>
              <p className="text-gray-400">השתמש בדומיין שלך לברנדינג מושלם ואמינות מוגברת</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <QrCode className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">QR קודים</h3>
              <p className="text-gray-400">יצירת QR קודים אוטומטית לכל לינק עם מעקב קליקים</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Smartphone className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">הפניות חכמות</h3>
              <p className="text-gray-400">הפנה משתמשים ליעדים שונים לפי מכשיר, מיקום או זמן</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">API מאובטח</h3>
              <p className="text-gray-400">גישה מלאה ל-API עם אימות טוקנים ותיעוד מלא</p>
            </div>

            {/* Feature 7 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">מהירות בזק</h3>
              <p className="text-gray-400">הפניות ב-50ms בממוצע עם CDN גלובלי</p>
            </div>

            {/* Feature 8 */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">ייצוא דוחות</h3>
              <p className="text-gray-400">הורדת דוחות CSV מפורטים לניתוח מעמיק</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">פשוט ב-3 צעדים</h2>
            <p className="text-gray-400 text-lg">התחל לעקוב אחרי הלינקים שלך בדקות</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">1</div>
              <h3 className="text-xl font-semibold text-white mb-3">צור לינק</h3>
              <p className="text-gray-400">הדבק את הלינק המקורי וקבל לינק קצר תוך שניות</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">2</div>
              <h3 className="text-xl font-semibold text-white mb-3">שתף</h3>
              <p className="text-gray-400">שתף את הלינק בכל פלטפורמה - רשתות חברתיות, מיילים, SMS</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">3</div>
              <h3 className="text-xl font-semibold text-white mb-3">נתח</h3>
              <p className="text-gray-400">עקוב אחרי כל קליק וקבל תובנות לשיפור הקמפיינים</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">מוכן להתחיל?</h2>
          <p className="text-xl text-gray-300 mb-8">
            הצטרף לאלפי משווקים שכבר משתמשים ב-Link Automator
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-12 py-6">
              צור חשבון חינם
            </Button>
          </SignUpButton>
          <p className="text-gray-400 mt-4 text-sm">ללא כרטיס אשראי • התחל תוך 30 שניות</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">Link Automator</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">תנאי שימוש</a>
              <a href="#" className="hover:text-white transition-colors">פרטיות</a>
              <a href="#" className="hover:text-white transition-colors">צור קשר</a>
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              © 2024 Just In Time. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

