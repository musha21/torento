import React, { useState } from 'react';
import { X, Calendar, MapPin, User, Car, Clock } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import type { LegacyVehicle } from '../types/database';
import {
  generateVehicleInquiryUrl,
  formatLkrPrice,
  convertLkrToUsd,
  vehicleTypeLabel,
} from '../utils/whatsapp';

interface WhatsAppBookingModalProps {
  vehicle: LegacyVehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('3');
  const [pickupLocation, setPickupLocation] = useState('Katunayake Airport (CMB)');
  const [driverOption, setDriverOption] = useState<'Self-Drive' | 'With Chauffeur'>('Self-Drive');
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen || !vehicle) return null;

  const durationNumber = parseInt(duration) || 1;
  const estimatedTotalLkr = vehicle.dailyRateLkr * durationNumber;

  const handleLaunchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    let endDate: string | undefined;
    if (startDate && /^\d{4}-\d{2}-\d{2}/.test(startDate)) {
      const d = new Date(`${startDate}T12:00:00`);
      d.setDate(d.getDate() + Math.max(durationNumber - 1, 0));
      endDate = d.toISOString().slice(0, 10);
    }
    const url = generateVehicleInquiryUrl(vehicle.name, {
      vehicleType: vehicleTypeLabel(vehicle.category),
      pricePerDay: vehicle.dailyRateLkr,
      startDate: startDate || 'Flexible / Upon arrival',
      endDate,
      rentalDays: durationNumber,
      pickupLocation,
      driverOption,
      customNotes: customNotes.trim() ? customNotes : undefined,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#ECE3D1] text-[#242320] border border-[#43282A]/20 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Inquiry Dialog"
          className="absolute top-4 right-4 p-2 text-[#43282A] hover:text-[#A86438] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-[#43282A]/15">
          <span className="font-editorial-sub text-[#A86438] text-[10px] tracking-[0.25em] block mb-1">
            DIRECT WHATSAPP INQUIRY
          </span>
          <h3 className="font-editorial-heading text-2xl sm:text-3xl uppercase text-[#242320]">
            {vehicle.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#43282A]/70 mt-1 font-mono">
            <span>{formatLkrPrice(vehicle.dailyRateLkr)}/day</span>
            <span>·</span>
            <span>{convertLkrToUsd(vehicle.dailyRateLkr)}</span>
            <span>·</span>
            <span className="text-[#A86438]">{vehicle.availability}</span>
          </div>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleLaunchWhatsApp} className="space-y-4 text-xs">
          {/* Pickup Location */}
          <div>
            <label className="block uppercase tracking-[0.16em] font-medium text-[#43282A] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A86438]" />
              Pickup & Drop-off Location
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-white border border-[#43282A]/25 px-3 py-2.5 text-sm text-[#242320] focus:outline-hidden focus:border-[#A86438]"
            >
              <option value="Bandaranaike Airport (CMB) / Katunayake">Bandaranaike International Airport (CMB) — Meet & Greet</option>
              <option value="Colombo City Center (Fort / Colpetty / Cinnamon Gardens)">Colombo City Center</option>
              <option value="Negombo Beach Town">Negombo Beach Town</option>
              <option value="Galle Fort / Unawatuna">Galle Fort / Southern Coast</option>
              <option value="Mirissa / Weligama">Mirissa / Weligama Surf Bay</option>
              <option value="Kandy City Center">Kandy Hill City</option>
              <option value="Ella Mountain Town">Ella Mountain Village</option>
            </select>
          </div>

          {/* Dates & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-[0.16em] font-medium text-[#43282A] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A86438]" />
                Estimated Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#43282A]/25 px-3 py-2 text-sm text-[#242320] focus:outline-hidden focus:border-[#A86438]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-[0.16em] font-medium text-[#43282A] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A86438]" />
                Duration (Days)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white border border-[#43282A]/25 px-3 py-2.5 text-sm text-[#242320] focus:outline-hidden focus:border-[#A86438]"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days (Long Weekend)</option>
                <option value="5">5 Days (Southern Coast)</option>
                <option value="7">7 Days (Island Loop)</option>
                <option value="10">10 Days (Comprehensive Tour)</option>
                <option value="14">14 Days (Full Grand Tour)</option>
                <option value="30">30+ Days (Monthly Explorer)</option>
              </select>
            </div>
          </div>

          {/* Driver Preference */}
          <div>
            <label className="block uppercase tracking-[0.16em] font-medium text-[#43282A] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#A86438]" />
              Driver Option
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Self-Drive', 'With Chauffeur'] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setDriverOption(opt)}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold border transition-all text-center cursor-pointer ${
                    driverOption === opt
                      ? 'bg-[#43282A] text-white border-[#43282A]'
                      : 'bg-white text-[#43282A] border-[#43282A]/25 hover:border-[#A86438]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#43282A]/70 mt-1">
              * International Driving Permit (IDP) with Sri Lankan endorsement is supported for self-drive.
            </p>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block uppercase tracking-[0.16em] font-medium text-[#43282A] mb-1.5">
              Flight / Travel Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g., Arriving on flight UL504 at 8:00 AM, need 1 child car seat / surf rack..."
              className="w-full bg-white border border-[#43282A]/25 p-2.5 text-sm text-[#242320] placeholder-[#43282A]/40 focus:outline-hidden focus:border-[#A86438]"
            />
          </div>

          {/* Price Calculation Summary */}
          <div className="bg-[#E6DCC8] p-3.5 border border-[#43282A]/15 rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#43282A]/70 block font-medium">
                Estimated {durationNumber}-Day Rate (Demo)
              </span>
              <span className="font-editorial-heading text-lg text-[#242320] font-semibold">
                {formatLkrPrice(estimatedTotalLkr)}
              </span>
              <span className="text-xs text-[#A86438] ml-2 font-mono">
                ({convertLkrToUsd(estimatedTotalLkr)})
              </span>
            </div>
            <div className="text-right text-[10px] text-[#43282A]/70 uppercase tracking-widest font-mono">
              Manual Quote on WhatsApp
            </div>
          </div>

          {/* Submit to WhatsApp */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-colors duration-200 shadow-md cursor-pointer mt-4"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Open WhatsApp with Custom Inquiry</span>
          </button>

          <p className="text-center text-[11px] text-[#43282A]/60">
            Clicking will open WhatsApp with your pre-filled inquiry. TORENTO team confirms availability manually.
          </p>
        </form>
      </div>
    </div>
  );
};
