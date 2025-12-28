import { Link2, BarChart3, Webhook, Globe, Zap, Shield, QrCode, Smartphone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const whatsappNumber = "972507877165";
  const whatsappMessage = encodeURIComponent("היי, אני מעוניין להשתמש ב-Link Automator");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Link Automator</span>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold gap-2">
              <MessageCircle className="w-4 h-4" />
              צור קשר
            </Button>
          </a>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center" dir="rtl">
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
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-6 gap-2">
                <MessageCircle className="w-5 h-5" />
                דבר איתנו בוואטסאפ
              </Button>
            </a>
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
      <section className="py-24 bg-gray-800/50" dir="rtl">
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
      <section className="py-24" dir="rtl">
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
      <section className="py-24 bg-gradient-to-r from-green-600/20 to-emerald-600/20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">מוכן להתחיל?</h2>
          <p className="text-xl text-gray-300 mb-8">
            צור איתנו קשר בוואטסאפ ונעזור לך להתחיל
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-12 py-6 gap-2">
              <MessageCircle className="w-5 h-5" />
              דבר איתנו עכשיו
            </Button>
          </a>
          <p className="text-gray-400 mt-4 text-sm">מענה מהיר • ללא התחייבות</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">Link Automator</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                צור קשר
              </a>
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              © Just In Time. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
