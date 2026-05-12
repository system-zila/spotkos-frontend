import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { SearchBar, SearchFilters } from '../components/SearchBar';
import { TrustSection } from '../components/TrustSection';
import { PopularCities } from '../components/PopularCities';
import { TopRatedRooms } from '../components/TopRatedRooms';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';
import { BlogSection } from '../components/BlogSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { CompareKos } from '../components/CompareKos';
import { CustomerSupport } from '../components/CustomerSupport';

export function Home() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Trust / Value Proposition Section */}
      <TrustSection />

      {/* Popular Cities Section */}
      <PopularCities />

      {/* Top Rated Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TopRatedRooms filters={searchFilters} />
      </section>

      {/* Compare Kos Section */}
      <CompareKos />

      {/* How SpotKos Works */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* Blog / Tips Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Customer Support Chat Widget */}
      <CustomerSupport />
    </div>
  );
}