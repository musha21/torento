import React, { useMemo } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDateKey } from '../../lib/availability';

export interface MonthCalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  unavailableDays?: Set<string>;
  /** Days with lighter markers (e.g. pending) — still clickable unless also unavailable */
  softMarkedDays?: Set<string>;
  pickupDate?: string | null;
  returnDate?: string | null;
  onSelectDay?: (dateKey: string) => void;
  /** Extra content under day number (admin chips) */
  renderDayExtra?: (dateKey: string, date: Date) => React.ReactNode;
  minDate?: Date;
  className?: string;
  /** When true, unavailable days are still selectable (admin view) */
  allowSelectUnavailable?: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  month,
  onMonthChange,
  unavailableDays = new Set(),
  softMarkedDays = new Set(),
  pickupDate,
  returnDate,
  onSelectDay,
  renderDayExtra,
  minDate,
  className = '',
  allowSelectUnavailable = false,
}) => {
  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : today;

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const pickup = pickupDate ? startOfDay(parseISO(pickupDate)) : null;
  const ret = returnDate ? startOfDay(parseISO(returnDate)) : null;

  const isInSelectedRange = (d: Date) => {
    if (!pickup || !ret) return false;
    if (isBefore(ret, pickup) || isSameDay(ret, pickup)) return false;
    try {
      return isWithinInterval(d, { start: pickup, end: ret }) && !isSameDay(d, ret);
    } catch {
      return false;
    }
  };

  return (
    <div className={`select-none ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(addMonths(month, -1))}
          className="p-2 rounded-lg border border-[#43282A]/15 hover:bg-[#E6DCC8]/60 text-[#43282A]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-editorial-heading text-lg text-[#242320] tracking-wide">
          {format(month, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="p-2 rounded-lg border border-[#43282A]/15 hover:bg-[#E6DCC8]/60 text-[#43282A]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] uppercase tracking-wider text-[#43282A]/50 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day);
          const inMonth = isSameMonth(day, month);
          const unavailable = unavailableDays.has(key);
          const soft = softMarkedDays.has(key);
          const past = isBefore(day, min);
          const isPickup = pickup && isSameDay(day, pickup);
          const isReturn = ret && isSameDay(day, ret);
          const inRange = isInSelectedRange(day);
          const disabled =
            !inMonth || past || (unavailable && !allowSelectUnavailable) || !onSelectDay;

          let cellClass =
            'relative min-h-[2.5rem] sm:min-h-[2.75rem] rounded-lg text-sm flex flex-col items-center justify-start pt-1.5 transition-colors ';

          if (!inMonth) {
            cellClass += 'text-[#43282A]/20 ';
          } else if (unavailable && !allowSelectUnavailable) {
            cellClass += 'bg-[#43282A]/12 text-[#43282A]/35 line-through cursor-not-allowed ';
          } else if (isPickup || isReturn) {
            cellClass += 'bg-[#A86438] text-white font-semibold ';
          } else if (inRange) {
            cellClass += 'bg-[#A86438]/25 text-[#43282A] ';
          } else if (soft) {
            cellClass += 'bg-[#A86438]/10 border border-dashed border-[#A86438]/40 text-[#43282A] ';
          } else if (unavailable && allowSelectUnavailable) {
            cellClass += 'bg-[#43282A]/10 text-[#43282A] ';
          } else {
            cellClass += 'hover:bg-[#E6DCC8]/80 text-[#242320] ';
          }

          if (isSameDay(day, today) && inMonth && !isPickup && !isReturn) {
            cellClass += 'ring-1 ring-[#A86438]/50 ';
          }

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDay?.(key)}
              className={cellClass}
            >
              <span className="tabular-nums text-xs sm:text-sm leading-none">{format(day, 'd')}</span>
              {renderDayExtra?.(key, day)}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-[#43282A]/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#A86438]" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#43282A]/20" /> Unavailable
        </span>
        {softMarkedDays.size > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-dashed border-[#A86438]/50" /> Pending
          </span>
        )}
      </div>
    </div>
  );
};
