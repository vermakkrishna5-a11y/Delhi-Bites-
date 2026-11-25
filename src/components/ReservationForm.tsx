import { FormEvent, useMemo, useState } from 'react';
import { Calendar, Check, Download, RotateCcw } from 'lucide-react';
import {
  MENU_ITEMS,
  RESTAURANT_INFO,
  SEATING_AREAS,
  SeatingArea,
  TIME_SLOTS_BY_AREA,
} from '../data/restaurant';

export interface ConfirmedReservation {
  code: string;
  guests: string;
  date: string;
  time: string;
  areaName: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  isGroupBooking: boolean;
}

interface ReservationFormProps {
  savedDishIds: string[];
  onRemoveSavedDish: (dishId: string) => void;
  compact?: boolean;
}

function getUpcomingOpenDates(): { value: string; label: string; sublabel: string }[] {
  const results: { value: string; label: string; sublabel: string }[] = [];
  const today = new Date();

  for (let offset = 0; offset < 4; offset += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const iso = d.toISOString().split('T')[0];
    const weekday =
      offset === 0
        ? 'Today'
        : offset === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dateText = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    results.push({ value: iso, label: weekday, sublabel: dateText });
  }
  return results;
}

function formatReadableDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function downloadCalendarFile(reservation: ConfirmedReservation) {
  const cleanDate = reservation.date.replace(/-/g, '');
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Delhi Bites Cafe and Restaurant//Reservation//EN',
    'BEGIN:VEVENT',
    `UID:${reservation.code}@delhibitescafe.in`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `SUMMARY:Table at ${RESTAURANT_INFO.name} (${reservation.guests})`,
    `LOCATION:${RESTAURANT_INFO.addressLine1}, ${RESTAURANT_INFO.addressLine2}`,
    `DESCRIPTION:Confirmation ${reservation.code} · ${reservation.time} · ${reservation.areaName}. ${reservation.notes ? `Notes: ${reservation.notes}` : ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `delhi-bites-booking-${reservation.code.toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const GUEST_OPTIONS = [
  '2 Guests',
  '3 Guests',
  '4 Guests',
  '5 Guests',
  '6 Guests',
  '8 Guests',
  'Group / Birthday Party (9–25)',
];

export function ReservationForm({
  savedDishIds,
  onRemoveSavedDish,
  compact = false,
}: ReservationFormProps) {
  const upcomingDates = useMemo(() => getUpcomingOpenDates(), []);
  const [guests, setGuests] = useState<string>('2 Guests');
  const [date, setDate] = useState<string>(upcomingDates[0]?.value ?? '');
  const [areaId, setAreaId] = useState<SeatingArea['id']>('cafe-hall');
  const [selectedTime, setSelectedTime] = useState<string>(
    TIME_SLOTS_BY_AREA['cafe-hall'][3].time
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<ConfirmedReservation | null>(null);

  const isGroupBooking = guests.startsWith('Group');
  const timeSlots = TIME_SLOTS_BY_AREA[areaId];

  const savedDishNames = useMemo(() => {
    return savedDishIds
      .map((id) => MENU_ITEMS.find((item) => item.id === id)?.name)
      .filter((name): name is string => Boolean(name));
  }, [savedDishIds]);

  const handleSelectArea = (nextArea: SeatingArea['id']) => {
    setAreaId(nextArea);
    const nextSlots = TIME_SLOTS_BY_AREA[nextArea];
    if (!nextSlots.some((slot) => slot.time === selectedTime)) {
      setSelectedTime(nextSlots[0].time);
    }
  };

  const handleDateChange = (nextDate: string) => {
    setDate(nextDate);
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.date;
      return updated;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!date) {
      nextErrors.date = 'Please select a date for your visit.';
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const areaObj = SEATING_AREAS.find((a) => a.id === areaId) ?? SEATING_AREAS[0];
    const combinedNotes = [
      savedDishNames.length > 0 ? `Noted dishes: ${savedDishNames.join(', ')}` : '',
      customNotes.trim(),
    ]
      .filter(Boolean)
      .join(' · ');

    const referenceNum = Math.floor(1000 + Math.random() * 9000);
    setConfirmed({
      code: `DBC-${referenceNum}`,
      guests,
      date,
      time: selectedTime,
      areaName: isGroupBooking ? 'Group & Party Section' : areaObj.name,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: combinedNotes,
      isGroupBooking,
    });
  };

  if (confirmed) {
    return (
      <div className="bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E2E2DE]">
          <div>
            <p className="text-xs font-medium text-[#1E3A2F] inline-flex items-center gap-1.5 mb-2">
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {confirmed.isGroupBooking
                  ? 'Group Booking Request Confirmed'
                  : 'Table Confirmed at Delhi Bites'}
              </span>
            </p>
            <h3 className="font-display text-3xl font-medium text-[#141514]">
              See you soon, {confirmed.fullName.split(' ')[0]}.
            </h3>
          </div>
          <span className="text-xs font-medium text-[#5A5C59] tabular-nums shrink-0 pt-1">
            Ref {confirmed.code}
          </span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-6 border-b border-[#E2E2DE] text-sm">
          <div>
            <dt className="text-xs text-[#5A5C59] mb-1">Date &amp; Time</dt>
            <dd className="font-medium text-[#141514] tabular-nums">
              {formatReadableDate(confirmed.date)} at {confirmed.time}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#5A5C59] mb-1">Party &amp; Seating</dt>
            <dd className="font-medium text-[#141514]">
              {confirmed.guests} · {confirmed.areaName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#5A5C59] mb-1">Guest Contact</dt>
            <dd className="text-[#141514] tabular-nums">
              {confirmed.email} · {confirmed.phone}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[#5A5C59] mb-1">Location</dt>
            <dd className="text-[#141514]">
              {RESTAURANT_INFO.addressLine1}, {RESTAURANT_INFO.city}
            </dd>
          </div>
          {confirmed.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-[#5A5C59] mb-1">Table Notes</dt>
              <dd className="text-[#141514]">{confirmed.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => downloadCalendarFile(confirmed)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Add to Calendar (.ics)</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmed(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#141514] border border-[#E2E2DE] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Modify Booking</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={
        compact
          ? 'space-y-6'
          : 'bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm p-6 sm:p-8 space-y-6'
      }
    >
      {/* Step 1: Party Size & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor={`guests-${compact ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-[#5A5C59] mb-2"
          >
            Party Size
          </label>
          <select
            id={`guests-${compact ? 'modal' : 'page'}`}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm focus:border-[#1E3A2F] focus:outline-none"
          >
            {GUEST_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`date-${compact ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-[#5A5C59] mb-2"
          >
            Date (Open All 7 Days)
          </label>
          <input
            id={`date-${compact ? 'modal' : 'page'}`}
            type="date"
            value={date}
            min={upcomingDates[0]?.value}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm tabular-nums focus:border-[#1E3A2F] focus:outline-none"
          />
          {errors.date && <p className="mt-1.5 text-xs text-red-700">{errors.date}</p>}
        </div>
      </div>

      {/* Quick Date Shortcuts */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#5A5C59] mb-2">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Open daily 8:00 AM – 11:00 PM</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {upcomingDates.map((d) => {
            const active = date === d.value;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => handleDateChange(d.value)}
                className={`px-3 py-2 text-left rounded-sm border transition-colors duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#1E3A2F] text-[#F8F8F6] border-[#1E3A2F]'
                    : 'bg-[#F8F8F6] text-[#141514] border-[#E2E2DE] hover:border-[#141514]/40'
                }`}
              >
                <span className="block text-xs font-medium">{d.label}</span>
                <span
                  className={`block text-[11px] tabular-nums ${
                    active ? 'text-[#F8F8F6]/80' : 'text-[#5A5C59]'
                  }`}
                >
                  {d.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Seating Area */}
      {!isGroupBooking && (
        <div>
          <span className="block text-xs font-medium text-[#5A5C59] mb-2">Seating Area</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SEATING_AREAS.map((area) => {
              const active = areaId === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleSelectArea(area.id)}
                  className={`p-3 text-left rounded-sm border transition-colors duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#EFEFED] border-[#1E3A2F] text-[#141514]'
                      : 'bg-[#F8F8F6] border-[#E2E2DE] text-[#5A5C59] hover:border-[#141514]/40'
                  }`}
                >
                  <span className="block text-sm font-medium text-[#141514]">{area.name}</span>
                  <span className="block text-xs text-[#5A5C59] mt-0.5 leading-snug">
                    {area.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Time Slots */}
      <div>
        <span className="block text-xs font-medium text-[#5A5C59] mb-2">
          Preferred Arrival Time
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {timeSlots.map((slot) => {
            const active = selectedTime === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => setSelectedTime(slot.time)}
                className={`px-3 py-2.5 rounded-sm border text-center transition-colors duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#1E3A2F] text-[#F8F8F6] border-[#1E3A2F]'
                    : 'bg-[#F8F8F6] text-[#141514] border-[#E2E2DE] hover:border-[#141514]/40'
                }`}
              >
                <span className="block text-sm font-medium tabular-nums">{slot.time}</span>
                <span
                  className={`block text-[11px] ${
                    active ? 'text-[#F8F8F6]/80' : 'text-[#5A5C59]'
                  }`}
                >
                  {slot.status === 'limited' ? 'Busy hour' : 'Available'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synced Menu Selections */}
      {savedDishNames.length > 0 && (
        <div className="p-4 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm">
          <p className="text-xs font-medium text-[#5A5C59] mb-2">
            Noted Menu Selections (shared with our kitchen)
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#141514]">
            {savedDishIds.map((id) => {
              const dish = MENU_ITEMS.find((item) => item.id === id);
              if (!dish) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1.5">
                  <span>{dish.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSavedDish(id)}
                    aria-label={`Remove ${dish.name} from table notes`}
                    className="text-xs text-[#5A5C59] hover:text-[#141514] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Guest Details */}
      <div className="pt-2 border-t border-[#E2E2DE] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`name-${compact ? 'modal' : 'page'}`}
              className="block text-xs font-medium text-[#5A5C59] mb-1.5"
            >
              Full Name
            </label>
            <input
              id={`name-${compact ? 'modal' : 'page'}`}
              type="text"
              autoComplete="name"
              placeholder="Aarav Verma"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>}
          </div>

          <div>
            <label
              htmlFor={`phone-${compact ? 'modal' : 'page'}`}
              className="block text-xs font-medium text-[#5A5C59] mb-1.5"
            >
              Mobile Number
            </label>
            <input
              id={`phone-${compact ? 'modal' : 'page'}`}
              type="tel"
              autoComplete="tel"
              placeholder="+91 98110 42190"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm tabular-nums placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label
            htmlFor={`email-${compact ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-[#5A5C59] mb-1.5"
          >
            Email Address
          </label>
          <input
            id={`email-${compact ? 'modal' : 'page'}`}
            type="email"
            autoComplete="email"
            placeholder="aarav@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
        </div>

        <div>
          <label
            htmlFor={`notes-${compact ? 'modal' : 'page'}`}
            className="block text-xs font-medium text-[#5A5C59] mb-1.5"
          >
            Spice Preference, Occasion or Pre-Order Note (Optional)
          </label>
          <textarea
            id={`notes-${compact ? 'modal' : 'page'}`}
            rows={2}
            placeholder="Less spicy Afghani Chaap, birthday cake table setup, extra mint chutney..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <p className="text-xs text-[#5A5C59]">
          Walk-ins always welcome · Instant confirmation with zero booking fee.
        </p>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isGroupBooking ? 'Request Group Table' : 'Confirm Table'}
        </button>
      </div>
    </form>
  );
}
