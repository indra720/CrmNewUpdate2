import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, Calendar, Briefcase, CreditCard, Fingerprint, FileText, GraduationCap, Landmark, Hash, Wallet, Building2, MapPin } from 'lucide-react';

interface DetailItem {
  label: string;
  value?: string | null;
  icon?: React.ElementType;
  type?: 'text' | 'switch';
  switchChecked?: boolean;
  switchDisabled?: boolean;
}

interface DetailsDialogProps {
  title: string;
  description: string;
  details: DetailItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  User: User,
  Phone: Phone,
  Mail: Mail,
  Calendar: Calendar,
  Briefcase: Briefcase,
  CreditCard: CreditCard,
  Fingerprint: Fingerprint,
  FileText: FileText,
  GraduationCap: GraduationCap,
  Landmark: Landmark,
  Hash: Hash,
  Wallet: Wallet,
  Building2: Building2,
  MapPin: MapPin,
};

const ReviewDetailItem = ({ label, value, icon: Icon, type, switchChecked, switchDisabled }: DetailItem) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border-b border-border-200 last:border-b-0 hover:bg-accent/50 transition-colors duration-200">
    <p className="text-sm font-medium text-muted-foreground flex items-center sm:w-1/2">
      {Icon && <Icon className="h-4 w-4 mr-2 text-primary" />}
      {label}
    </p>
    {type === 'switch' ? (
      <div className="sm:w-1/2 sm:text-right mt-1 sm:mt-0">
        <Switch checked={switchChecked} disabled={switchDisabled} />
      </div>
    ) : (
      <p className="font-semibold text-foreground sm:w-1/2 sm:text-right mt-1 sm:mt-0">{value || 'N/A'}</p>
    )}
  </div>
);

export const DetailsDialog: React.FC<DetailsDialogProps> = ({
  title,
  description,
  details,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] p-4 rounded-2xl shadow-2xl flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {details.map((item, index) => (
            <ReviewDetailItem
              key={index}
              label={item.label}
              value={item.value}
              icon={item.icon ? iconMap[item.icon.displayName || item.icon.name] : undefined}
              type={item.type}
              switchChecked={item.switchChecked}
              switchDisabled={item.switchDisabled}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
