'use client';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Crown, Info, Shield, ShieldCheck, User } from 'lucide-react';

export function RoleInfoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Info className="text-muted-foreground h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4 text-xs">
        <h4 className="mb-3 text-sm font-semibold">راهنمای نقش‌ها</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="font-medium text-amber-600">مالک</p>
              <p className="text-muted-foreground mt-0.5">
                بالاترین سطح دسترسی. می‌تواند پروژه را حذف کند.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-primary font-medium">مدیر پروژه</p>
              <p className="text-muted-foreground mt-0.5">مدیریت اعضا، تنظیمات و همه تسک‌ها.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div>
              <p className="font-medium text-blue-500">مدیر اجرایی</p>
              <p className="text-muted-foreground mt-0.5">
                ایجاد، ویرایش و حذف همه تسک‌ها. نمی‌تواند اعضا را مدیریت کند.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <User className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-muted-foreground font-medium">عضو</p>
              <p className="text-muted-foreground mt-0.5">
                مشاهده تسک‌ها، کامنت و تغییر وضعیت تسک‌های خود.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 mt-3 rounded-lg p-2.5">
          <p className="text-muted-foreground text-[10px] leading-relaxed">
            <span className="text-foreground font-medium">نکته:</span> مالک پروژه همیشه یک نفر است و
            قابل تغییر نیست. مدیران پروژه می‌توانند نقش سایر اعضا را تغییر دهند.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
