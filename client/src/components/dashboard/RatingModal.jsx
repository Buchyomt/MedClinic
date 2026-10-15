import { API_BASE_URL } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';

export default function RatingModal({ appointment, onClose, onRatingComplete }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch(`${API_BASE_URL}/api/appointments/${appointment._id}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback })
    })
      .then(res => res.json())
      .then(updated => {
        setSubmitting(false);
        onRatingComplete(updated);
        onClose();
      })
      .catch(err => {
        console.error('Error submitting rating:', err);
        setSubmitting(false);
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-yellow-50 dark:bg-yellow-950/40 text-yellow-500 flex items-center justify-center mx-auto mb-3">
          <Star size={32} className="fill-yellow-400" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Rate Your Consultation
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
          How was your appointment with <span className="font-bold text-gray-800 dark:text-slate-200">{appointment?.doctorId?.name || 'Doctor'}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Selection */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Leave feedback for the doctor (optional)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border text-xs font-bold text-gray-700 dark:text-slate-300"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-2xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-1"
            >
              <CheckCircle2 size={16} />
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
