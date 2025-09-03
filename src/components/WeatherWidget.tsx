import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, CloudRain, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  data?: Array<{
    date: string;
    tavg: number;
    tmin: number;
    tmax: number;
    prcp: number;
    wspd: number;
  }>;
}

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: {
          lat,
          lon,
          alt: 100,
          start: `${currentYear}-01-01`,
          end: `${currentYear}-12-31`
        }
      });

      if (error) throw error;
      
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getLatestWeatherData = () => {
    if (!weatherData?.data || weatherData.data.length === 0) return null;
    return weatherData.data[weatherData.data.length - 1];
  };

  const latestData = getLatestWeatherData();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold">Weather</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={getUserLocation}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          {loading ? "Loading..." : "Get Weather"}
        </Button>
      </div>

      {error && (
        <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {location && !loading && !error && (
        <div className="text-sm text-muted-foreground mb-4">
          Location: {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
        </div>
      )}

      {latestData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Temp</p>
                <p className="font-semibold">{latestData.tavg}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Precipitation</p>
                <p className="font-semibold">{latestData.prcp}mm</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Min: {latestData.tmin}°C</span>
            <span>Max: {latestData.tmax}°C</span>
            <span>Wind: {latestData.wspd}km/h</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Data from: {latestData.date}
          </p>
        </div>
      )}

      {!weatherData && !loading && !error && (
        <p className="text-muted-foreground text-center py-8">
          Click "Get Weather" to see weather data for your location
        </p>
      )}
    </Card>
  );
};

export default WeatherWidget;