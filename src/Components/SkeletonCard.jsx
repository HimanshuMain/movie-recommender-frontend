import "../App.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster" />
      <div className="skeleton-text short" />
      <div className="skeleton-text" />
    </div>
  );
}
