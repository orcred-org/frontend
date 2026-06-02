/**
 * OrcredMark — orange fruit icon (body + stem + leaf), all filled #eb4511.
 * `size` controls the width; height scales with the viewBox ratio (~1.27×).
 * `glow` adds a CSS drop-shadow that follows the shape.
 */
export default function OrcredMark({
  size = 16,
  glow = false,
}: {
  size?: number;
  glow?: boolean;
}) {
  // viewBox is 22 × 28 → height = size × (28/22)
  const h = Math.round(size * 28 / 22);

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 22 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={
        glow
          ? { filter: "drop-shadow(0 0 7px var(--orange-dim))", flexShrink: 0 }
          : { flexShrink: 0 }
      }
    >
      {/* Leaf — filled ellipse, slightly tilted */}
      <ellipse
        cx="7.5"
        cy="5.5"
        rx="2.6"
        ry="4.4"
        fill="#eb4511"
        transform="rotate(-15 7.5 5.5)"
      />

      {/* Stem — thick rounded stroke curving upper-right */}
      <path
        d="M10.5 10 C13 6.5 17 4.5 20 3"
        stroke="#eb4511"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Orange body */}
      <circle cx="10.5" cy="19" r="9" fill="#eb4511" />
    </svg>
  );
}
