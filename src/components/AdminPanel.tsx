import React, { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Activity, UserX, Mail, Calendar, Edit } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { ErrorLogsTable } from './ErrorLogsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthStatusPanel from './HealthStatusPanel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type AppRole = Database['public']['Enums']['app_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];
type CancelledSubscription = Database['public']['Tables']['cancelled_subscriptions']['Row'];

interface UserWithRoles extends Profile {
  user_roles: UserRole[];
}

const AdminPanel = () => {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [cancelledSubscriptions, setCancelledSubscriptions] = useState<CancelledSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [followUpNotes, setFollowUpNotes] = useState<string>('');
  const [selectedCancellation, setSelectedCancellation] = useState<CancelledSubscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!roleLoading && isAdmin()) {
      fetchUsers();
      fetchCancelledSubscriptions();
    } else if (!roleLoading) {
      setLoading(false);
    }
  }, [isAdmin, roleLoading]);

  const fetchUsers = async () => {
    try {
      // Fetch profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        toast({
          title: "Error",
          description: "Failed to fetch user roles",
          variant: "destructive",
        });
        return;
      }

      // Combine the data
      const usersWithRoles = profilesData.map(profile => ({
        ...profile,
        user_roles: rolesData.filter(role => role.user_id === profile.id)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelledSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('cancelled_subscriptions')
        .select('*')
        .order('cancelled_at', { ascending: false });

      if (error) {
        console.error('Error fetching cancelled subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch cancelled subscriptions",
          variant: "destructive",
        });
        return;
      }

      setCancelledSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching cancelled subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cancelled subscriptions",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      // First, remove existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
        });

      if (error) {
        console.error('Error updating user role:', error);
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const markFollowUpSent = async (cancellationId: string) => {
    try {
      const { error } = await supabase
        .from('cancelled_subscriptions')
        .update({ follow_up_sent: true })
        .eq('id', cancellationId);

      if (error) {
        console.error('Error marking follow-up as sent:', error);
        toast({
          title: "Error",
          description: "Failed to mark follow-up as sent",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Follow-up marked as sent",
        });
        fetchCancelledSubscriptions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error marking follow-up as sent:', error);
      toast({
        title: "Error",
        description: "Failed to mark follow-up as sent",
        variant: "destructive",
      });
    }
  };

  const updateFollowUpNotes = async (cancellationId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('cancelled_subscriptions')
        .update({ notes })
        .eq('id', cancellationId);

      if (error) {
        console.error('Error updating follow-up notes:', error);
        toast({
          title: "Error",
          description: "Failed to update notes",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Notes updated successfully",
        });
        fetchCancelledSubscriptions(); // Refresh the list
        setSelectedCancellation(null);
        setFollowUpNotes('');
      }
    } catch (error) {
      console.error('Error updating follow-up notes:', error);
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="w-12 h-12 mx-auto text-destructive" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You need administrator privileges to access this panel.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="follow-ups" className="flex items-center gap-2">
            <UserX className="w-4 h-4" />
            Follow-ups
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const userRole = user.user_roles[0]?.role || 'user';
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={userRole === 'admin' ? 'destructive' : userRole === 'moderator' ? 'secondary' : 'outline'}>
                          {userRole}
                        </Badge>
                        
                        <Select
                          value={userRole}
                          onValueChange={(newRole: AppRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="follow-ups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Cancelled Subscriptions Follow-up
              </CardTitle>
              <CardDescription>
                Track and follow up with users who cancelled their subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Cancelled Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Follow-up Sent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledSubscriptions.map((cancellation) => (
                      <TableRow key={cancellation.id}>
                        <TableCell className="font-medium">{cancellation.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{cancellation.subscription_tier || 'Unknown'}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(cancellation.cancelled_at)}</TableCell>
                        <TableCell className="max-w-32 truncate">
                          {cancellation.cancellation_reason || 'Not specified'}
                        </TableCell>
                        <TableCell>
                          {cancellation.follow_up_sent ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              <Mail className="w-3 h-3 mr-1" />
                              Sent
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Calendar className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {!cancellation.follow_up_sent && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => markFollowUpSent(cancellation.id)}
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Mark Sent
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCancellation(cancellation);
                                    setFollowUpNotes(cancellation.notes || '');
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Follow-up Notes</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Email: <span className="font-medium">{cancellation.email}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      Cancelled: {formatDate(cancellation.cancelled_at)}
                                    </p>
                                  </div>
                                  <Textarea
                                    placeholder="Add follow-up notes..."
                                    value={followUpNotes}
                                    onChange={(e) => setFollowUpNotes(e.target.value)}
                                    rows={4}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedCancellation(null);
                                        setFollowUpNotes('');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        if (selectedCancellation) {
                                          updateFollowUpNotes(selectedCancellation.id, followUpNotes);
                                        }
                                      }}
                                    >
                                      Save Notes
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {cancelledSubscriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No cancelled subscriptions to follow up on
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <HealthStatusPanel />
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <ErrorLogsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;