import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  Users, 
  Heart, 
  MapPin, 
  Phone, 
  Mail,
  Shield,
  BookOpen,
  MessageCircle,
  LogIn,
  User,
  Settings,
  ArrowRight,
  ChevronDown,
  Clock,
  Instagram,
  Twitter,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import FloatingElements from "@/components/FloatingElements";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import ModernNav from "@/components/navigation/ModernNav";

// TikTok Icon Component (lucide-react doesn't have TikTok)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Index = () => {
  const { user, userRole, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [officeStatus, setOfficeStatus] = useState<{ isOpen: boolean; nextChange: string } | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkOfficeStatus = () => {
      // Kenya timezone (Africa/Nairobi - UTC+3)
      const now = new Date();
      const kenyaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }));
      const day = kenyaTime.getDay(); // 0 = Sunday, 6 = Saturday
      const hours = kenyaTime.getHours();
      const minutes = kenyaTime.getMinutes();
      const currentTime = hours * 60 + minutes; // Convert to minutes
      const openTime = 8 * 60 + 30; // 8:30 AM = 510 minutes
      const closeTime = 17 * 60 + 30; // 5:30 PM = 1050 minutes

      let isOpen = false;
      let nextChange = "";

      // Monday to Friday (1-5)
      if (day >= 1 && day <= 5) {
        if (currentTime >= openTime && currentTime < closeTime) {
          isOpen = true;
          // Calculate time until close
          const minutesUntilClose = closeTime - currentTime;
          const hoursUntilClose = Math.floor(minutesUntilClose / 60);
          const minsUntilClose = minutesUntilClose % 60;
          nextChange = `Closes at 5:30 PM (in ${hoursUntilClose}h ${minsUntilClose}m)`;
        } else if (currentTime < openTime) {
          // Before opening
          const minutesUntilOpen = openTime - currentTime;
          const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
          const minsUntilOpen = minutesUntilOpen % 60;
          nextChange = `Opens at 8:30 AM (in ${hoursUntilOpen}h ${minsUntilOpen}m)`;
        } else {
          // After closing, next opening is tomorrow
          const minutesUntilMidnight = (24 * 60) - currentTime;
          const minutesUntilOpen = minutesUntilMidnight + openTime;
          const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
          const minsUntilOpen = minutesUntilOpen % 60;
          nextChange = `Opens tomorrow at 8:30 AM (in ${hoursUntilOpen}h ${minsUntilOpen}m)`;
        }
      } else {
        // Weekend (Saturday or Sunday)
        isOpen = false;
        if (day === 6) {
          // Saturday - opens Monday
          const minutesUntilMidnight = (24 * 60) - currentTime;
          const minutesUntilMonday = minutesUntilMidnight + (24 * 60); // Sunday
          const minutesUntilOpen = minutesUntilMonday + openTime; // Monday 8:30 AM
          const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
          nextChange = `Opens Monday at 8:30 AM (in ${hoursUntilOpen}h)`;
        } else {
          // Sunday - opens tomorrow (Monday)
          const minutesUntilMidnight = (24 * 60) - currentTime;
          const minutesUntilOpen = minutesUntilMidnight + openTime;
          const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
          nextChange = `Opens Monday at 8:30 AM (in ${hoursUntilOpen}h)`;
        }
      }

      setOfficeStatus({ isOpen, nextChange });
    };

    checkOfficeStatus();
    // Update every minute
    const interval = setInterval(checkOfficeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Navigation */}
      <ModernNav />

      {/* Hero Section with Background Slideshow */}
      <section id="hero" className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 min-h-screen flex items-center overflow-hidden">
        <BackgroundSlideshow />
        <FloatingElements />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div 
            className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl">
                <span className="bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent animate-gradient">
                  Defending Human Rights
                </span>
                <br />
                <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white/90 drop-shadow-lg">
                  in <span className="relative">
                    Kenya
                    <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_0.5s_forwards] origin-left shadow-lg"></div>
                  </span>
                </span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-lg backdrop-blur-sm bg-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                Haki Yetu Organization champions human rights for marginalized communities 
                across Kenya's coastal counties through 
                <span className="font-semibold text-green-200"> legal advocacy</span>, 
                <span className="font-semibold text-blue-200"> community empowerment</span>, 
                and <span className="font-semibold text-purple-200">transformative justice</span>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12">
              <MagneticButton 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border-0 text-white"
                onClick={() => handleScrollToSection('contact')}
              >
                Get Legal Help
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </MagneticButton>
              <MagneticButton 
                size="lg" 
                variant="outline" 
                className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white shadow-xl"
                onClick={() => handleScrollToSection('services')}
              >
                <span className="hidden xs:inline">Learn About Our Work</span>
                <span className="xs:hidden">Our Work</span>
                <BookOpen className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </MagneticButton>
            </div>

            <button 
              onClick={() => handleScrollToSection('services')}
              className="mx-auto flex items-center text-white/80 hover:text-green-200 transition-colors duration-300 group backdrop-blur-sm bg-black/10 px-3 sm:px-4 py-2 rounded-full border border-white/20"
            >
              <span className="text-xs sm:text-sm font-medium mr-2">Discover More</span>
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce group-hover:text-green-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 md:py-24 relative bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
        <FloatingElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Our Core Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive human rights advocacy across multiple domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Scale,
                title: "Legal Advocacy",
                description: "Free legal representation for marginalized communities in land rights, housing disputes, and constitutional matters.",
                color: "green",
                gradient: "from-green-500 to-emerald-600",
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80"
              },
              {
                icon: Users,
                title: "Community Empowerment",
                description: "Training programs, workshops, and capacity building to empower communities to advocate for their own rights.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-600",
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
              },
              {
                icon: Heart,
                title: "Gender Justice",
                description: "Specialized support for gender-based violence survivors and advocacy for women's and girls' rights.",
                color: "red",
                gradient: "from-red-500 to-pink-600",
                image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80"
              },
              {
                icon: Shield,
                title: "Governance & Accountability",
                description: "Monitoring government institutions and advocating for transparent, accountable public service delivery.",
                color: "purple",
                gradient: "from-purple-500 to-violet-600",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
              },
              {
                icon: BookOpen,
                title: "Human Rights Education",
                description: "Public education campaigns and school programs to raise awareness about human rights and civic responsibilities.",
                color: "orange",
                gradient: "from-orange-500 to-amber-600",
                image: "https://images.unsplash.com/photo-1503676260721-4d00c4ef78f0?w=800&q=80"
              },
              {
                icon: MessageCircle,
                title: "Policy Advocacy",
                description: "Research, policy analysis, and advocacy to influence laws and policies that protect human rights.",
                color: "teal",
                gradient: "from-teal-500 to-cyan-600",
                image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
              }
            ].map((service, index) => (
              <TiltCard key={service.title}>
                <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                  {/* Service Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                    <div className={`absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                  </div>
                  
                  <CardHeader className="relative z-10 pb-4 flex-1 flex flex-col">
                    <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-3">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed flex-1">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section id="offices" className="py-16 sm:py-20 md:py-24 bg-white/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-transparent to-blue-100/30"></div>
        <FloatingElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Our Offices
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              Serving communities across Kenya's coastal region since 2008
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                location: "Mombasa",
                title: "Main headquarters",
                description: "Our main office coordinates regional operations and houses our legal team and administrative staff.",
                phone: "+254 (0) 700 000 000",
                email: "mombasa@hakiyetu.org",
                color: "green",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                location: "Kilifi",
                title: "Northern coastal operations",
                description: "Serving Kilifi County with focus on land rights and community development programs.",
                phone: "+254 (0) 700 000 001",
                email: "kilifi@hakiyetu.org",
                color: "blue",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                location: "Kwale",
                title: "Southern coastal operations",
                description: "Providing legal aid and advocacy services to communities in Kwale County and surrounding areas.",
                phone: "+254 (0) 700 000 002",
                email: "kwale@hakiyetu.org",
                color: "red",
                gradient: "from-red-500 to-pink-600"
              }
            ].map((office, index) => (
              <TiltCard key={office.location}>
                <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${office.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <CardHeader className="relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${office.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      {office.location} Office
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                      {office.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      {office.description}
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center group/item">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-gray-400 group-hover/item:text-green-600 transition-colors duration-200" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 group-hover/item:text-green-700 transition-colors duration-200">{office.phone}</span>
                      </div>
                      <div className="flex items-center group/item">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-gray-400 group-hover/item:text-green-600 transition-colors duration-200" />
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 group-hover/item:text-green-700 transition-colors duration-200">{office.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */} 
<section id="contact" className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
  <FloatingElements />
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 sm:mb-16 md:mb-20">
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6">
        Contact Us
      </h2>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
        Get in touch with Haki Yetu Organization for legal assistance and support
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
      {/* Contact Information Card */}
      <TiltCard>
        <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <CardHeader className="relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-6">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-start gap-3 group/item">
                <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0 group-hover/item:text-green-700 transition-colors duration-200" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Address</p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Star of the Sea Primary, Off Nyerere Road, Mombasa
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    P.O. Box 92253-80102, Mombasa, Kenya 80102
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 group/item">
                <Phone className="h-5 w-5 text-green-600 flex-shrink-0 group-hover/item:text-green-700 transition-colors duration-200" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Phone</p>
                  <a href="tel:0800723544" className="text-sm sm:text-base text-gray-700 hover:text-green-700 transition-colors duration-200">
                    0800 723 544
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 group/item">
                <Mail className="h-5 w-5 text-green-600 flex-shrink-0 group-hover/item:text-green-700 transition-colors duration-200" />
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Email</p>
                  <a href="mailto:info@hakiyetu.ke" className="text-sm sm:text-base text-gray-700 hover:text-green-700 transition-colors duration-200 break-all">
                    info@hakiyetu.ke
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Social Media</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://instagram.com/haki_yetu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/social flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6 text-white" />
                </a>
                <a 
                  href="https://x.com/HakiYetuOrg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/social flex items-center justify-center w-12 h-12 rounded-xl bg-black hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Twitter className="h-6 w-6 text-white" />
                </a>
                <a 
                  href="https://tiktok.com/@hakiyetuorganisation" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/social flex items-center justify-center w-12 h-12 rounded-xl bg-black hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Follow us on TikTok"
                >
                  <TikTokIcon className="h-6 w-6 text-white" />
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm sm:text-base font-semibold text-gray-900">Working Hours</p>
                {officeStatus && (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${officeStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-xs sm:text-sm font-semibold ${officeStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {officeStatus.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {officeStatus ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Monday - Friday:</span> 8:30 AM - 5:30 PM
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Saturday - Sunday:</span> CLOSED
                      </p>
                    </div>
                    {officeStatus.nextChange && (
                      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        {officeStatus.nextChange}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-semibold">Monday - Friday:</span> 8:30 AM - 5:30 PM</p>
                    <p><span className="font-semibold">Saturday - Sunday:</span> CLOSED</p>
                  </div>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </TiltCard>

      {/* Optional Contact Form Card */}
      <TiltCard>
        <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            {/* Simple Form */}
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
              <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Send Message
              </button>
            </form>
          </CardContent>
        </Card>
      </TiltCard>

    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-xl text-white py-12 sm:py-16 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6 group">
              <div className="relative">
                <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-green-400 mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                Haki Yetu Organization
              </h3>
            </div>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl">
              Amplifying voices, defending rights, transforming communities since 2008
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8 text-xs sm:text-sm md:text-base mb-6 sm:mb-8">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:underline">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:underline">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:underline">Contact</a>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2024 Haki Yetu Organization. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
