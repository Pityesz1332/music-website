import { useMemo } from "react";
import type { ReactNode } from "react";
import { Clock, Music, Library, Star } from "lucide-react";
import { calculateTotalPlaytime, getTopGenre } from "../../../utils/statsHelpers";
import "./StatsDashboard.scss";

type Genre = string;
type Song = { title: string; duration: string; genre: Genre };

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
};

interface StatsDashboardProps {
  recentlyPlayed: Song[];
};

export const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <article className="stats-dashboard__card">
      <div className="stats-dashboard__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="stats-dashboard__label">{label}</p>
      <p className="stats-dashboard__value">{value}</p>
    </article>
  );
}

export const formatTopGenre = (topGenre: ReturnType<typeof getTopGenre>) => {
  if (!topGenre) {
    return "-";
  }

  return `${topGenre.genre} (${topGenre.percentage}%)`;
}

export const StatsDashboard = ({ recentlyPlayed }: StatsDashboardProps) => {
  const stats = useMemo(() => {
    const allSongs = [...recentlyPlayed];
    return {
      recentPlaytime: calculateTotalPlaytime(recentlyPlayed),
      totalPlaytime: calculateTotalPlaytime(allSongs),
      topGenre: getTopGenre(allSongs)
    };
  }, [recentlyPlayed]);

  return (
    <section className="stats-dashboard" aria-label="Listening statistics">
      <StatCard icon={<Clock size={18} />} label="Recent Playtime" value={stats.recentPlaytime.formatted} />
      <StatCard icon={<Music size={18} />} label="Recently Played" value={recentlyPlayed.length} />
      <StatCard icon={<Library size={18} />} label="Total Playtime" value={stats.totalPlaytime.formatted} />
      <StatCard icon={<Star size={18} />} label="Top Genre" value={formatTopGenre(stats.topGenre)} />
    </section>
  );

}