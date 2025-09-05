import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Clock, AlertCircle, TestTube, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useErrorLogger } from '@/hooks/useErrorLogger';

interface ErrorLog {
  id: string;
  user_id: string | null;
  error_type: string;
  operation: string;
  error_message: string;
  error_details: any;
  file_info: any;
  user_agent: string | null;
  url: string | null;
  severity: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export const ErrorLogsTable: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logSystemError, logUploadError, logAiError, logProcessingError, logNetworkError } = useErrorLogger();
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    errorType: 'all',
    severity: 'all',
    resolved: 'all',
    search: ''
  });

  const fetchErrorLogs = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (filter.errorType !== 'all') {
        query = query.eq('error_type', filter.errorType as any);
      }
      if (filter.severity !== 'all') {
        query = query.eq('severity', filter.severity as any);
      }
      if (filter.resolved !== 'all') {
        query = query.eq('resolved', filter.resolved === 'true');
      }
      if (filter.search) {
        query = query.or(`operation.ilike.%${filter.search}%,error_message.ilike.%${filter.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setErrorLogs(data || []);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch error logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('error_logs')
        .update({ resolved: true })
        .eq('id', logId);

      if (error) throw error;

      setErrorLogs(prev => prev.map(log => 
        log.id === logId ? { ...log, resolved: true } : log
      ));

      toast({
        title: "Success",
        description: "Error marked as resolved",
      });
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast({
        title: "Error",
        description: "Failed to mark error as resolved",
        variant: "destructive",
      });
    }
  };

  const runErrorTest = async () => {
    try {
      // Test different error types
      await logSystemError('test_system_error', 'Test system error from admin panel', { testMode: true });
      await logUploadError('test_upload_error', 'Test upload error from admin panel', { 
        name: 'test.jpg', 
        size: 1024, 
        type: 'image/jpeg' 
      });
      await logAiError('test_ai_error', 'Test AI error from admin panel', { model: 'test', prompt: 'test prompt' });
      await logProcessingError('test_processing_error', 'Test processing error from admin panel');
      await logNetworkError('test_network_error', 'Test network error from admin panel');

      toast({
        title: "Test Completed",
        description: "Successfully logged 5 test errors",
      });

      // Refresh the logs to show the new test errors
      fetchErrorLogs();
    } catch (error) {
      console.error('Error running test:', error);
      toast({
        title: "Test Failed",
        description: "Failed to log test errors",
        variant: "destructive",
      });
    }
  };

  const deleteErrorLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('error_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      setErrorLogs(prev => prev.filter(log => log.id !== logId));

      toast({
        title: "Success",
        description: "Error log deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting log:', error);
      toast({
        title: "Error",
        description: "Failed to delete error log",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [user, filter]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getErrorTypeColor = (errorType: string) => {
    switch (errorType) {
      case 'upload_error': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing_error': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ai_error': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'system_error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'auth_error': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'network_error': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading error logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Logs</CardTitle>
        <CardDescription>
          Monitor and manage application errors and issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search operations or messages..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filter.errorType}
            onValueChange={(value) => setFilter(prev => ({ ...prev, errorType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Error Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="upload_error">Upload Error</SelectItem>
              <SelectItem value="processing_error">Processing Error</SelectItem>
              <SelectItem value="ai_error">AI Error</SelectItem>
              <SelectItem value="system_error">System Error</SelectItem>
              <SelectItem value="auth_error">Auth Error</SelectItem>
              <SelectItem value="network_error">Network Error</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.severity}
            onValueChange={(value) => setFilter(prev => ({ ...prev, severity: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.resolved}
            onValueChange={(value) => setFilter(prev => ({ ...prev, resolved: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="false">Unresolved</SelectItem>
              <SelectItem value="true">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Test Section */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={runErrorTest}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <TestTube className="w-4 h-4" />
            Test Error Logging
          </Button>
        </div>

        {errorLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No error logs found matching your criteria.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.operation}
                    </TableCell>
                    <TableCell>
                      <Badge className={getErrorTypeColor(log.error_type)}>
                        {log.error_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={log.error_message}>
                      {log.error_message}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.user_id ? log.user_id.substring(0, 8) : 'Anonymous'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.resolved ? 'default' : 'destructive'}>
                        {log.resolved ? 'Resolved' : 'Unresolved'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!log.resolved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsResolved(log.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteErrorLog(log.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};