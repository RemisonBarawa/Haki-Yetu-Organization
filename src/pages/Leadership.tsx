import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award,
  Shield,
  BookOpen
} from "lucide-react";
import FloatingElements from "@/components/FloatingElements";
import TiltCard from "@/components/TiltCard";
import ModernNav from "@/components/navigation/ModernNav";

interface LeadershipMember {
  name: string;
  role: string;
  title: string;
  description: string;
  gradient: string;
  icon: typeof Users;
  color: string;
  image: string;
}

const Leadership = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leadershipMembers: LeadershipMember[] = [
    {
      name: "Fr Gabriel Dolan",
      role: "Chairperson",
      title: "Founder & Visionary Leader",
      description: "Fr. Gabriel Dolan is an Irish missionary priest with the St. Patrick's Missionary Society who has worked in Kenya since 1982, serving in Turkana, Kitale, and Mombasa. He is the founder of Haki Yetu Organisation and has dedicated his life to social justice, land rights, and the protection of civic space. His work has had a lasting impact on Kenya's human rights landscape.",
      gradient: "from-green-500 to-emerald-600",
      icon: Shield,
      color: "green",
      image: "https://res.cloudinary.com/dwhp5xrhn/image/upload/v1764313107/father-gabriel-dolan-1_xmbg80.jpg"
    },
    {
      name: "Fr Raphael Mwenda",
      role: "Vice Chairperson",
      title: "Community Advocate",
      description: "Fr. Raphael Mwenda serves as Vice Chairperson of the Haki Yetu Board. He brings years of pastoral and community experience to the organisation and is committed to justice and the empowerment of vulnerable populations.",
      gradient: "from-blue-500 to-cyan-600",
      icon: Users,
      color: "blue",
      image: "https://res.cloudinary.com/dwhp5xrhn/image/upload/v1764313112/Father-Raphael-Mwenda_heiso6.png"
    },
    {
      name: "Mr. Peter Kiama",
      role: "Board Secretary",
      title: "Executive Director",
      description: "As the Executive Director of Haki Yetu, Mr. Kiama has expressed deep concern over ongoing human rights violations in Kenya, including abductions, enforced disappearances, and extrajudicial killings. He emphasizes the need for the government to uphold the rule of law and ensure citizens' safety.",
      gradient: "from-purple-500 to-violet-600",
      icon: Award,
      color: "purple",
      image: "https://res.cloudinary.com/dwhp5xrhn/image/upload/v1764313107/Peter-Kiama_xyrapg.jpg"
    },
    {
      name: "Mr Moses Ombati",
      role: "Member",
      title: "Senior Accountant",
      description: "Moses Ombati serves as the Senior Accountant of the Catholic Archdiocese of Mombasa. With more than two decades of experience in finance and administration, he contributes strong oversight and governance skills to the board.",
      gradient: "from-orange-500 to-amber-600",
      icon: BookOpen,
      color: "orange",
      image: "https://res.cloudinary.com/dwhp5xrhn/image/upload/v1764313107/moses-ombati_is4nyg.jpg"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Modern Navigation */}
      <ModernNav />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
        <FloatingElements />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div 
            className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-green-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                  Our Leadership
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Meet the dedicated leaders guiding Haki Yetu's mission to defend human rights 
                and empower communities across Kenya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Members Section */}
      <section className="py-16 sm:py-20 md:py-24 relative">
        <FloatingElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {leadershipMembers.map((member, index) => {
              const IconComponent = member.icon;
              return (
                <TiltCard key={member.name}>
                  <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                    {/* Portrait */}
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-80`}></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-xl`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">{member.name}</p>
                            <p className="text-white/80 text-sm">{member.title}</p>
                          </div>
                        </div>
                        <Badge 
                          className={`bg-white/20 text-white border border-white/40 shadow-lg text-xs sm:text-sm px-3 py-1`}
                        >
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Header with Icon and Badge */}
                    <CardHeader className="relative z-10 pb-4">
                      <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 mb-2">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-base sm:text-lg md:text-xl text-gray-600 font-semibold">
                        {member.title}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 flex-1 flex flex-col">
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6 flex-1">
                        {member.description}
                      </p>
                      
                      {/* Decorative Element */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${member.gradient} group-hover:w-full transition-all duration-500`}></div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 sm:py-20 md:py-24 relative bg-white/60 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-transparent to-blue-100/30"></div>
        <FloatingElements />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <TiltCard>
            <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-4">
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Under the guidance of our dedicated leadership team, Haki Yetu continues to champion 
                  human rights, social justice, and community empowerment across Kenya. Our board members 
                  bring decades of combined experience in advocacy, governance, and community service, 
                  ensuring that our mission remains focused on creating lasting positive change.
                </p>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-xl text-white py-12 sm:py-16 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6 group">
              <div className="relative">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-green-400 mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
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

export default Leadership;

