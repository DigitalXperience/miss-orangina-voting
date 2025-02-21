import React from 'react';
import { Calendar, Filter } from 'lucide-react';

interface StatsFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
}

export function StatsFilters({ dateRange, onDateRangeChange, onRefresh }: StatsFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      {/* Sélecteur de période */}
      <div className="flex items-center space-x-4 bg-gray-900 p-2 rounded-lg">
        <Calendar className="text-gold w-5 h-5" />
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="bg-transparent text-white focus:outline-none"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
          <option value="all">Tout</option>
        </select>
      </div>

      {/* Autres filtres */}
      <div className="flex items-center space-x-4 bg-gray-900 p-2 rounded-lg">
        <Filter className="text-gold w-5 h-5" />
        <select
          className="bg-transparent text-white focus:outline-none"
          defaultValue="all"
        >
          <option value="all">Toutes les régions</option>
          <option value="douala">Douala</option>
          <option value="yaounde">Yaoundé</option>
          <option value="other">Autres</option>
        </select>
      </div>

      {/* Bouton de rafraîchissement */}
      <button
        onClick={onRefresh}
        className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Rafraîchir
      </button>
    </div>
  );
}