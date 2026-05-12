import { useState } from 'react';
import { Search, MapPin, Sliders } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './ui/sheet';

export interface SearchFilters {
  location: string;
  priceRange: [number, number];
  facilities: string[];
  gender: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
  const [location, setLocation] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [gender, setGender] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSearch = () => {
    onSearch({
      location,
      priceRange,
      facilities,
      gender,
    });
    setIsOpen(false);
    // Delay scroll to allow Sheet close animation to complete
    setTimeout(() => {
      const resultsSection = document.getElementById('rekomendasi');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
  };

  const handleReset = () => {
    setLocation('');
    setPriceRange([500000, 5000000]);
    setFacilities([]);
    setGender('all');
    onSearch({
      location: '',
      priceRange: [500000, 5000000],
      facilities: [],
      gender: 'all',
    });
  };

  return (
    <div id="cari-kos" className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location Search */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Cari kos berdasarkan kota, kampus, atau lokasi..."
            className="pl-12 h-14 rounded-2xl border-2 focus:border-primary"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>

        {/* Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-14 px-6 rounded-2xl border-2">
              <Sliders className="w-5 h-5 mr-2" />
              Filter
              {(facilities.length > 0 || gender !== 'all') && (
                <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {facilities.length + (gender !== 'all' ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-l-3xl w-full sm:max-w-md overflow-y-auto flex flex-col">
            <SheetHeader className="pb-6 border-b">
              <SheetTitle className="text-2xl">Filter Pencarian</SheetTitle>
              <SheetDescription>Atur filter pencarian Anda di sini.</SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto mt-6 space-y-8 pb-6">
              {/* Price Range Filter */}
              <div className="bg-secondary/20 rounded-2xl p-5">
                <label className="block text-lg font-semibold mb-2">
                  Rentang Harga
                </label>
                <div className="text-primary font-semibold text-xl mb-4">
                  Rp {(priceRange[0] / 1000).toLocaleString('id-ID')}K - Rp {(priceRange[1] / 1000000).toFixed(1)}Jt
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={500000}
                  max={5000000}
                  step={100000}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Rp 500K</span>
                  <span>Rp 5Jt</span>
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-secondary/20 rounded-2xl p-5">
                <label className="block text-lg font-semibold mb-4">Fasilitas</label>
                <div className="space-y-1">
                  {['AC', 'Wi-Fi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Dapur', 'Listrik Pasca Bayar'].map((facility) => (
                    <label 
                      key={facility} 
                      className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-secondary/30 transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-primary cursor-pointer"
                        checked={facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                      />
                      <span className="text-base">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="bg-secondary/20 rounded-2xl p-5">
                <label className="block text-lg font-semibold mb-4">Jenis Kelamin</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-2xl h-12 text-base bg-white border-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="Putra">Putra</SelectItem>
                    <SelectItem value="Putri">Putri</SelectItem>
                    <SelectItem value="Campur">Campur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t bg-white p-4 space-y-3 mt-auto">
              <Button
                onClick={handleSearch}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Temukan Kos
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-12 rounded-2xl"
              >
                Reset Filter
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90"
        >
          <Search className="w-5 h-5 mr-2" />
          Cari Kos Sekarang
        </Button>
      </div>
    </div>
  );
}