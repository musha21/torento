import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="rounded-xl border border-[#D8C9AD]/60 bg-white/40 px-6 py-12 text-center">
    <Inbox className="mx-auto mb-3 h-10 w-10 text-[#A86438]/70" />
    <h3 className="font-editorial-heading text-xl text-[#242320]">{title}</h3>
    {description && <p className="mt-2 text-sm text-[#43282A]/80 max-w-md mx-auto">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
