import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Calendar,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plane,
  RefreshCw
} from 'lucide-react';

interface Reminder {
  id: string;
  type: 'expiry' | 'renewal' | 'trip' | 'document';
  title: string;
  description: string;
  date: string;
  status: 'active' | 'snoozed' | 'completed';
  priority: 'low' | 'medium' | 'high';
  visaId?: string;
  channels: ('email' | 'sms' | 'push')[];
}

interface ReminderSystemProps {
  reminders?: Reminder[];
}

export const ReminderSystem = ({ reminders = mockReminders }: ReminderSystemProps) => {
  const { t } = useTranslation();
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    advance30Days: true,
    advance7Days: true,
    advance1Day: true
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiry':
        return <AlertTriangle className="h-4 w-4" />;
      case 'renewal':
        return <RefreshCw className="h-4 w-4" />;
      case 'trip':
        return <Plane className="h-4 w-4" />;
      case 'document':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTimeUntil = (date: string) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diffTime = reminderDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return t('reminders.overdue', 'Overdue');
    if (diffDays === 0) return t('reminders.today', 'Today');
    if (diffDays === 1) return t('reminders.tomorrow', 'Tomorrow');
    if (diffDays < 7) return t('reminders.inDays', `In ${diffDays} days`);
    if (diffDays < 30) return t('reminders.inWeeks', `In ${Math.ceil(diffDays / 7)} weeks`);
    return t('reminders.inMonths', `In ${Math.ceil(diffDays / 30)} months`);
  };

  return (
    <div className="space-y-6">
      {/* Reminder Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('reminders.title', 'Smart Reminders')}
          </h2>
          <p className="text-muted-foreground">
            {t('reminders.subtitle', 'Never miss important visa deadlines and travel dates')}
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {t('reminders.settings', 'Settings')}
        </Button>
      </div>

      {/* Active Reminders */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {t('reminders.active', 'Active Reminders')}
        </h3>
        
        {reminders.filter(r => r.status === 'active').map((reminder) => (
          <Card key={reminder.id} className="hover-lift animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getPriorityColor(reminder.priority)}`}>
                    {getTypeIcon(reminder.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{reminder.title}</h4>
                      <Badge className={`${getPriorityColor(reminder.priority)} border text-xs`}>
                        {t(`reminders.priority.${reminder.priority}`, reminder.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reminder.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(reminder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeUntil(reminder.date)}</span>
                      </div>
                      {reminder.visaId && (
                        <div className="flex items-center gap-1">
                          <span>Visa: {reminder.visaId}</span>
                        </div>
                      )}
                    </div>

                    {/* Notification Channels */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-muted-foreground">
                        {t('reminders.notifyVia', 'Notify via:')}
                      </span>
                      {reminder.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                          {channel === 'sms' && <MessageSquare className="h-3 w-3 mr-1" />}
                          {channel === 'push' && <Bell className="h-3 w-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    {t('reminders.snooze', 'Snooze')}
                  </Button>
                  <Button size="sm" variant="outline">
                    {t('reminders.done', 'Done')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('reminders.settingsTitle', 'Notification Preferences')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Channels */}
          <div>
            <h4 className="font-medium mb-4">
              {t('reminders.channels', 'Notification Channels')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{t('reminders.email', 'Email Notifications')}</span>
                </div>
                <Switch 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{t('reminders.sms', 'SMS Notifications')}</span>
                </div>
                <Switch 
                  checked={notificationSettings.sms}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>{t('reminders.push', 'Push Notifications')}</span>
                </div>
                <Switch 
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Timing Settings */}
          <div>
            <h4 className="font-medium mb-4">
              {t('reminders.timing', 'Reminder Timing')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{t('reminders.advance30', '30 days before expiry')}</span>
                <Switch 
                  checked={notificationSettings.advance30Days}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, advance30Days: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span>{t('reminders.advance7', '7 days before expiry')}</span>
                <Switch 
                  checked={notificationSettings.advance7Days}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, advance7Days: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span>{t('reminders.advance1', '1 day before expiry')}</span>
                <Switch 
                  checked={notificationSettings.advance1Day}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, advance1Day: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reminders.recent', 'Recent Notifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reminders.filter(r => r.status === 'completed').slice(0, 3).map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Completed • {new Date(reminder.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock data for demonstration
const mockReminders: Reminder[] = [
  {
    id: 'rem-001',
    type: 'expiry',
    title: 'UK ETA Expiring Soon',
    description: 'Your UK ETA (ETA-2024-001234) will expire in 30 days',
    date: '2024-12-31',
    status: 'active',
    priority: 'high',
    visaId: 'ETA-2024-001234',
    channels: ['email', 'push']
  },
  {
    id: 'rem-002',
    type: 'renewal',
    title: 'Renewal Reminder',
    description: 'Consider renewing your UK ETA before your upcoming trip',
    date: '2024-11-15',
    status: 'active',
    priority: 'medium',
    visaId: 'ETA-2024-001234',
    channels: ['email']
  },
  {
    id: 'rem-003',
    type: 'trip',
    title: 'Travel Checklist',
    description: 'Your trip to London is in 7 days. Ensure your ETA is ready',
    date: '2024-04-01',
    status: 'active',
    priority: 'medium',
    channels: ['email', 'push', 'sms']
  },
  {
    id: 'rem-004',
    type: 'document',
    title: 'Document Verification Complete',
    description: 'Your UK ETA application documents have been verified',
    date: '2024-03-15',
    status: 'completed',
    priority: 'low',
    visaId: 'ETA-2024-001235',
    channels: ['email']
  }
];