import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Activity, Server, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthMetric {
  id: string;
  timestamp: string;
  endpoint_name: string;
  response_time_ms: number;
  status_code: number;
  success: boolean;
  error_message?: string;
  metadata?: any;
  created_at: string;
}

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  response_time_ms: number;
  database: {
    connected: boolean;
    error?: string;
  };
  uptime?: number;
  version: string;
}

const HealthStatusPanel = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<HealthCheckResponse | null>(null);
  const { toast } = useToast();

  // Fetch historical health metrics
  const { data: metrics = [], isLoading, refetch } = useQuery({
    queryKey: ['health-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as HealthMetric[];
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Manual health check
  const performHealthCheck = async () => {
    setIsChecking(true);
    try {
      const response = await supabase.functions.invoke('health-check');
      const healthData = response.data as HealthCheckResponse;
      
      setLastCheck(healthData);
      refetch(); // Refresh metrics
      
      toast({
        title: "Health Check Complete",
        description: `Status: ${healthData.status} (${healthData.response_time_ms}ms)`,
        variant: healthData.status === 'healthy' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to perform health check",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Auto health check on mount
  useEffect(() => {
    performHealthCheck();
  }, []);

  // Calculate metrics
  const recentMetrics = metrics.slice(0, 24); // Last 24 checks
  const successRate = recentMetrics.length > 0 
    ? (recentMetrics.filter(m => m.success).length / recentMetrics.length) * 100 
    : 0;
  const avgResponseTime = recentMetrics.length > 0
    ? recentMetrics.reduce((sum, m) => sum + m.response_time_ms, 0) / recentMetrics.length
    : 0;

  // Chart data
  const chartData = metrics.slice(0, 20).reverse().map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    responseTime: metric.response_time_ms,
    success: metric.success
  }));

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'default' : 'destructive'} className="gap-1">
        {success ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
        {success ? 'Healthy' : 'Unhealthy'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health Monitor
        </CardTitle>
        <CardDescription>
          Monitor application performance and system health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {lastCheck && getStatusBadge(lastCheck.status === 'healthy')}
              {lastCheck && (
                <div className="text-sm text-muted-foreground">
                  Last check: {new Date(lastCheck.timestamp).toLocaleString()}
                </div>
              )}
            </div>
            <Button 
              onClick={performHealthCheck} 
              disabled={isChecking}
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Check Now'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle className="w-4 h-4" />
                Success Rate (24h)
              </div>
              <div className="text-2xl font-bold text-primary">
                {successRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" />
                Avg Response Time
              </div>
              <div className="text-2xl font-bold text-primary">
                {avgResponseTime.toFixed(0)}ms
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Server className="w-4 h-4" />
                Database
              </div>
              <div className="text-2xl font-bold text-primary">
                {lastCheck?.database.connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="logs">Recent Checks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'responseTime' ? `${value}ms` : value,
                        name === 'responseTime' ? 'Response Time' : name
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(metric.success)}
                      <div className="text-sm">
                        <div>{new Date(metric.timestamp).toLocaleString()}</div>
                        {metric.error_message && (
                          <div className="text-destructive text-xs">{metric.error_message}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{metric.response_time_ms}ms</div>
                      <div className="text-muted-foreground">Status {metric.status_code}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusPanel;