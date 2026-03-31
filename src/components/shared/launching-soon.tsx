export function LaunchingSoon({ feature, description }: {
  feature: string;
  description: string;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-4xl mb-4">🏔️</div>
      <h3 className="text-lg font-medium text-(--text-primary) mb-2">
        {feature} — Launching Soon
      </h3>
      <p className="text-sm text-(--text-muted) max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
