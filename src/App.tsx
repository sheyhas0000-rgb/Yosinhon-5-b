/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Battery, 
  ShieldCheck, 
  Clock, 
  Search, 
  ChevronRight, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Wrench,
  Cpu,
  Droplets,
  Camera,
  MessageSquare,
  User,
  LogOut
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';

const SERVICES = [
  {
    id: 'screen',
    title: 'Ekran almashtirish',
    description: 'Barcha turdagi smartfonlar uchun original va sifatli ekranlar.',
    price: '150,000 so\'mdan',
    icon: Smartphone,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 'battery',
    title: 'Batareya almashtirish',
    description: 'Sizning qurilmangiz uchun yangi va uzoq muddatli quvvat.',
    price: '80,000 so\'mdan',
    icon: Battery,
    color: 'text-green-500',
    bg: 'bg-green-50'
  },
  {
    id: 'water',
    title: 'Suvdan tozalash',
    description: 'Qurilmangiz suvga tushgan bo\'lsa, biz uni qutqaramiz.',
    price: '100,000 so\'mdan',
    icon: Droplets,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50'
  },
  {
    id: 'software',
    title: 'Dasturiy xizmatlar',
    description: 'Proshivka, blokdan chiqarish va ma\'lumotlarni tiklash.',
    price: '50,000 so\'mdan',
    icon: Cpu,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    id: 'camera',
    title: 'Kamera ta\'mirlash',
    description: 'Old va orqa kameralarni almashtirish va sozlash.',
    price: '120,000 so\'mdan',
    icon: Camera,
    color: 'text-red-500',
    bg: 'bg-red-50'
  },
  {
    id: 'other',
    title: 'Boshqa muammolar',
    description: 'Dinamik, mikrofon, tugmalar va korpus ta\'mirlash.',
    price: '40,000 so\'mdan',
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  }
];

const MOCK_ORDERS: Record<string, { status: string, device: string, progress: number, date: string }> = {
  'IFIX-1234': {
    status: 'Ta\'mirlanmoqda',
    device: 'iPhone 13 Pro',
    progress: 65,
    date: '2024-04-12'
  },
  'IFIX-5678': {
    status: 'Tayyor',
    device: 'Samsung S22 Ultra',
    progress: 100,
    date: '2024-04-10'
  },
  'IFIX-9012': {
    status: 'Qabul qilindi',
    device: 'Xiaomi Redmi Note 11',
    progress: 10,
    date: '2024-04-13'
  }
};

export default function App() {
  const [orderId, setOrderId] = useState('');
  const [orderResult, setOrderResult] = useState<typeof MOCK_ORDERS[string] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchUser();
        toast.success('Google orqali kirdingiz!');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        url,
        'google_login',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      toast.error('Google login xatoligi');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    toast.success('Tizimdan chiqdingiz');
  };

  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    if (user) return;
    const newCount = clickCount + 1;
    if (newCount >= 3) {
      handleGoogleLogin();
      setClickCount(0);
    } else {
      setClickCount(newCount);
      // Reset count after 2 seconds of inactivity
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    const result = MOCK_ORDERS[orderId.toUpperCase()];
    if (result) {
      setOrderResult(result);
      toast.success('Buyurtma topildi!');
    } else {
      setOrderResult(null);
      toast.error('Buyurtma topilmadi. ID ni tekshirib ko\'ring.');
    }
  };

  const handleBook = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get('name') || formData.get('modal-name'),
      phone: formData.get('phone') || formData.get('modal-phone'),
      device: formData.get('device') || formData.get('modal-device'),
      issue: formData.get('issue') || '',
      userEmail: user?.email || 'Mehmon',
    };

    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Sizning so\'rovingiz qabul qilindi! Tez orada bog\'lanamiz.');
        setIsBookingOpen(false);
      } else {
        toast.error('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    } catch (error) {
      toast.error('Server bilan bog\'lanishda xatolik.');
    }
  };

  const isAdmin = user?.email === 'sheyhas0000@gmail.com';

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      
      {/* Floating Admin Panel - Only visible to Admin */}
      <AnimatePresence>
        {isAdmin && (
          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-end gap-2 pointer-events-none">
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: 100 }}
              className="pointer-events-auto"
            >
              <Button 
                className="rounded-l-full h-14 pl-6 pr-4 shadow-2xl bg-zinc-900 hover:bg-zinc-800 border-y border-l border-white/10 group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Admin</div>
                    <div className="text-sm font-bold">Boshqaruv</div>
                  </div>
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-auto mr-2"
            >
              <Card className="w-64 glass p-4 border-zinc-200 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div className="overflow-hidden">
                    <div className="font-bold text-sm truncate">{user.name}</div>
                    <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 px-2">Admin Funksiyalari</div>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                    <a href="#track">Barcha buyurtmalar</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> Chiqish
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">iFix Service</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#services" className="hover:text-zinc-900 transition-colors">Xizmatlar</a>
            <a href="#track" className="hover:text-zinc-900 transition-colors">Holatni tekshirish</a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">Kontaktlar</a>
          </nav>

          <Button onClick={() => setIsBookingOpen(true)} size="sm" className="rounded-full px-6">
            Buyurtma berish
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Professional Telefon Servis
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                  Telefoningizga <span className="text-zinc-400">ikkinchi hayot</span> bering
                </h1>
                <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
                  Tezkor, sifatli va kafolatlangan ta'mirlash xizmatlari. Biz sizning qurilmangizni 24 soat ichida sozlab beramiz.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg" onClick={() => setIsBookingOpen(true)}>
                    Hozir buyurtma berish
                  </Button>
                  <a 
                    href="#track" 
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8 h-14 text-lg")}
                  >
                    Buyurtmani kuzatish
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
            <Smartphone className="w-full h-full rotate-12" />
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y bg-zinc-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Muvaffaqiyatli ta\'mirlar', value: '15,000+' },
                { label: 'Yillik tajriba', value: '8 yil' },
                { label: 'Kafolat muddati', value: '12 oy' },
                { label: 'Mijozlar roziligi', value: '99%' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Bizning xizmatlarimiz</h2>
              <p className="text-zinc-600">Barcha turdagi smartfon va planshetlar uchun professional texnik yordam ko'rsatamiz.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-zinc-100 group cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-zinc-500 leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <span className="font-bold text-zinc-900">{service.price}</span>
                      <Button variant="ghost" size="sm" className="gap-1 group/btn">
                        Batafsil <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Track Order Section */}
        <section id="track" className="py-24 bg-zinc-900 text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Buyurtmangiz holatini tekshiring</h2>
                  <p className="text-zinc-400 mb-8 text-lg">
                    Sizga berilgan kvitansiya raqamini kiriting va qurilmangiz qaysi bosqichda ekanligini bilib oling.
                  </p>
                  <form onSubmit={handleTrack} className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        placeholder="Masalan: IFIX-1234" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="bg-white/10 border-white/20 text-white h-12 rounded-xl focus:ring-zinc-500"
                      />
                    </div>
                    <Button type="submit" size="lg" className="bg-white text-zinc-900 hover:bg-zinc-200 h-12 rounded-xl px-8">
                      Tekshirish
                    </Button>
                  </form>
                  <p className="mt-4 text-xs text-zinc-500">
                    Sinab ko'rish uchun: <span className="text-zinc-300 font-mono">IFIX-1234</span>, <span className="text-zinc-300 font-mono">IFIX-5678</span>
                  </p>
                </div>

                <div className="min-h-[300px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {orderResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full"
                      >
                        <Card className="bg-white/5 border-white/10 text-white backdrop-blur-xl">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-2xl mb-1">{orderResult.device}</CardTitle>
                                <CardDescription className="text-zinc-400">ID: {orderId.toUpperCase()}</CardDescription>
                              </div>
                              <Badge className={orderResult.status === 'Tayyor' ? 'bg-green-500' : 'bg-blue-500'}>
                                {orderResult.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Jarayon</span>
                                <span className="font-bold">{orderResult.progress}%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${orderResult.progress}%` }}
                                  className="h-full bg-white"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {orderResult.date}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4" />
                                6 oy kafolat
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-zinc-500"
                      >
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Buyurtma ma'lumotlari bu yerda ko'rinadi</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 relative">
                  <img 
                    src="https://picsum.photos/seed/repair/800/800" 
                    alt="Repair process" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="glass p-6 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">Sifat kafolati</div>
                        <div className="text-sm text-zinc-600">Faqat original ehtiyot qismlar</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold mb-8">Nima uchun bizni tanlashadi?</h2>
                <div className="space-y-8">
                  {[
                    {
                      title: 'Tezkor xizmat',
                      desc: 'Aksariyat ta\'mirlash ishlari 1-2 soat ichida, mijozning ko\'z o\'ngida amalga oshiriladi.',
                      icon: Clock
                    },
                    {
                      title: 'Professional ustalar',
                      desc: 'Bizning mutaxassislarimiz 5 yildan ortiq tajribaga ega va doimiy malaka oshirib borishadi.',
                      icon: ShieldCheck
                    },
                    {
                      title: 'Bepul diagnostika',
                      desc: 'Qurilmangizni tekshirish va muammoni aniqlash mutlaqo bepul.',
                      icon: Search
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-zinc-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden border-none shadow-xl">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12 bg-zinc-900 text-white">
                    <h2 className="text-3xl font-bold mb-6">Biz bilan bog'laning</h2>
                    <p className="text-zinc-400 mb-10">Savollaringiz bormi? Bizga qo'ng'iroq qiling yoki xabar qoldiring.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Telefon</div>
                          <div className="font-medium">+998 93 857 09 71</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Manzil</div>
                          <div className="font-medium">Namangan shahar, Namangan tumani, 1-Bahor ko'chasi, 4-uy</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Telegram</div>
                          <div className="font-medium">@ifix_service_admin</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 bg-white">
                    <form onSubmit={handleBook} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Ismingiz</Label>
                        <Input id="name" name="name" placeholder="Ismingizni kiriting" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Telefon raqamingiz</Label>
                        <Input id="phone" name="phone" placeholder="+998 __ ___ __ __" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="device">Qurilma modeli</Label>
                        <Input id="device" name="device" placeholder="Masalan: iPhone 14 Pro" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="issue">Muammo tavsifi</Label>
                        <textarea 
                          id="issue" 
                          name="issue" 
                          className="flex min-h-[100px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Muammoni qisqacha tushuntiring..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-xl">Xabar yuborish</Button>
                    </form>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleLogoClick}>
              <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">iFix Service</span>
            </div>
            
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              © 2024 iFix Service. Barcha huquqlar himoyalangan.
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">Instagram</a>
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">Telegram</a>
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ta'mirlash uchun buyurtma</DialogTitle>
            <DialogDescription>
              Ma'lumotlaringizni qoldiring, biz 15 daqiqa ichida siz bilan bog'lanamiz.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBook} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="modal-name">Ismingiz</Label>
              <Input id="modal-name" name="modal-name" placeholder="Ismingizni kiriting" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modal-phone">Telefon raqamingiz</Label>
              <Input id="modal-phone" name="modal-phone" placeholder="+998 __ ___ __ __" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modal-device">Qurilma modeli</Label>
              <Input id="modal-device" name="modal-device" placeholder="Masalan: Redmi 14 pro" required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">Yuborish</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
