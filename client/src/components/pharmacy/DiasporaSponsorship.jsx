import React, { useState } from 'react';
import { HeartHandshake, Globe, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

const SPONSORSHIP_PLANS = [
  {
    id: 'hypertension-care',
    name: 'Parent Hypertension & Cardiovascular Shield',
    feeUSD: '$35 / month',
    feeNGN: '₦50,000 / month',
    tag: 'Most Popular for Elderly Parents',
    features: [
      'Monthly genuine BP medication refills delivered to their home in Onitsha',
      'Bi-weekly home blood pressure check & logging by certified pharmacy nurse',
      'Direct WhatsApp status reports sent to sponsor in Diaspora/Lagos',
      'Emergency 24/7 pharmacist on-call access for acute blood pressure spikes'
    ]
  },
  {
    id: 'diabetes-comprehensive',
    name: 'Comprehensive Diabetes & Glycemic Care Package',
    feeUSD: '$50 / month',
    feeNGN: '₦75,000 / month',
    tag: 'Full Diabetes Adherence',
    features: [
      'Monthly Metformin / Insulin / Glimepiride cold-chain delivered to Onitsha home',
      'Glucometer test strips & lancet replenishment included',
      'HbA1c & fasting blood glucose audit with physician coordination',
      'Nutritional & diet compliance counseling for Igbo/Nigerian staples'
    ]
  },
  {
    id: 'vip-senior-wellness',
    name: 'Total Senior Executive Wellness & Polypharmacy Retainer',
    feeUSD: '$80 / month',
    feeNGN: '₦120,000 / month',
    tag: 'All-Inclusive Concierge Care',
    features: [
      'Full polypharmacy drug conflict review for multi-condition parents',
      'Weekly home vitals visits (BP, Glucose, Oxygen saturation, Pulse)',
      'Direct 1-on-1 monthly video conference with Pharm. Chinedu and family sponsor',
      'Free emergency prescription dispatch anywhere in Anambra State'
    ]
  }
];

export default function DiasporaSponsorship() {
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorLocation, setSponsorLocation] = useState(''); // e.g. London UK, Houston TX, Lagos
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorPhone, setSponsorPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('hypertension-care');
  const [currency, setCurrency] = useState('NGN'); // 'NGN' | 'USD'
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPlan = SPONSORSHIP_PLANS.find(p => p.id === selectedPlanId) || SPONSORSHIP_PLANS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `*New Diaspora Parent Care Sponsorship Request*%0A` +
      `*Sponsor:* ${encodeURIComponent(sponsorName)} (${encodeURIComponent(sponsorLocation)})%0A` +
      `*Sponsor Contact:* ${encodeURIComponent(sponsorPhone)} | ${encodeURIComponent(sponsorEmail)}%0A` +
      `*Parent in Onitsha:* ${encodeURIComponent(parentName)}%0A` +
      `*Parent Address in Onitsha:* ${encodeURIComponent(parentAddress)}%0A` +
      `*Selected Care Plan:* ${encodeURIComponent(selectedPlan.name)} (${encodeURIComponent(currency === 'USD' ? selectedPlan.feeUSD : selectedPlan.feeNGN)})%0A` +
      `%0APlease initiate clinical onboarding with Pharm. Chinedu Nwankwo at Your Health Pharmacy, Onitsha.`;

    window.open(`https://wa.me/2347025051669?text=${msg}`, '_blank');
    setIsSuccess(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold border border-indigo-200 dark:border-indigo-800">
            <Globe size={14} />
            <span>Diaspora & Remote Family Care Service • Peace of Mind</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Sponsor Your Elderly Parent's Medications in Onitsha
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Living in the UK, USA, Canada, or Lagos? Ensure your elderly mother or father in Onitsha receives continuous clinical pharmacist check-ups, genuine chronic medications, and monthly vitals reports.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setCurrency('NGN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              currency === 'NGN' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            ₦ NGN
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              currency === 'USD' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            $ USD / Int'l
          </button>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SPONSORSHIP_PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-400 shadow-lg'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                  {plan.tag}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {plan.name}
                </h3>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {currency === 'USD' ? plan.feeUSD : plan.feeNGN}
                </p>

                <ul className="space-y-1.5 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`py-2 px-3 rounded-xl text-center text-xs font-black transition-all ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {isSelected ? '✓ Plan Selected' : 'Select Plan'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboarding Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-left">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck size={16} className="text-indigo-500" />
          <span>Sponsorship & Parent Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Your Name (Sponsor) *
            </label>
            <input
              type="text"
              required
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              placeholder="e.g. Dr. Ngozi Nwosu"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Where Do You Live? *
            </label>
            <input
              type="text"
              required
              value={sponsorLocation}
              onChange={(e) => setSponsorLocation(e.target.value)}
              placeholder="e.g. London UK / Houston TX / Victoria Island Lagos"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Your WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              required
              value={sponsorPhone}
              onChange={(e) => setSponsorPhone(e.target.value)}
              placeholder="e.g. +44 7911 123456 or +234 802..."
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Your Email (For Monthly Clinical Reports) *
            </label>
            <input
              type="email"
              required
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              placeholder="e.g. ngozi@gmail.com"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Parent's Full Name (In Onitsha) *
            </label>
            <input
              type="text"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Elder Emmanuel Nwosu"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Parent's Address in Onitsha *
            </label>
            <input
              type="text"
              required
              value={parentAddress}
              onChange={(e) => setParentAddress(e.target.value)}
              placeholder="e.g. GRA Federal Housing / Fegge / 3-3, Onitsha"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <HeartHandshake size={18} />
          <span>Connect with Pharm. Chinedu to Sponsor Care for {parentName || "Parent"}</span>
          <ArrowRight size={18} />
        </button>

        {isSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Sponsorship details forwarded to Pharm. Chinedu Nwankwo. You will receive a direct onboarding consultation message!</span>
          </div>
        )}
      </form>

    </div>
  );
}
