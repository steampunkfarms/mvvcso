interface ZoneDiagramProps {
  labels: {
    house: string;
    zone0: string;
    zone1: string;
    zone2: string;
    slopeNote: string;
    sdCountyNote: string;
  };
  ariaLabel?: string;
}

export function ZoneDiagram({ labels, ariaLabel }: ZoneDiagramProps) {
  const describedAria =
    ariaLabel ?? `${labels.zone0}, ${labels.zone1}, ${labels.zone2}`;

  return (
    <figure className="my-8">
      <svg
        viewBox="0 0 600 600"
        role="img"
        aria-label={describedAria}
        className="w-full h-auto text-(--text-primary)"
      >
        <circle
          cx="300"
          cy="300"
          r="280"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <circle
          cx="300"
          cy="300"
          r="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <circle
          cx="300"
          cy="300"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="270"
          y="280"
          width="60"
          height="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <polygon
          points="270,280 300,250 330,280"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <text
          x="300"
          y="345"
          textAnchor="middle"
          fontSize="16"
          fill="currentColor"
        >
          {labels.house}
        </text>
        <text
          x="300"
          y="232"
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="currentColor"
        >
          {labels.zone0}
        </text>
        <text
          x="300"
          y="135"
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="currentColor"
        >
          {labels.zone1}
        </text>
        <text
          x="300"
          y="40"
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="currentColor"
        >
          {labels.zone2}
        </text>
      </svg>
      <figcaption className="mt-4 text-sm text-(--text-muted) leading-relaxed">
        {labels.sdCountyNote} {labels.slopeNote}
      </figcaption>
    </figure>
  );
}
