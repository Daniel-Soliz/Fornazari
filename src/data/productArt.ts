function encodeSvg(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function createProductIllustration(
  label: string,
  sublabel: string,
  accent: string,
  bg: string,
  iconType: 'bag' | 'can' | 'bone' | 'ball' | 'collar' | 'bottle' | 'bed'
): string {
  const icons: Record<typeof iconType, string> = {
    bag: `
      <rect x="135" y="72" width="130" height="162" rx="14" fill="white" stroke="${accent}" stroke-width="3"/>
      <path d="M148 72 L162 52 L238 52 L252 72" fill="${bg}" stroke="${accent}" stroke-width="3"/>
      <rect x="152" y="102" width="96" height="54" rx="8" fill="${accent}" opacity="0.14"/>
      <circle cx="200" cy="129" r="14" fill="${accent}"/>
      <path d="M192 129 L198 135 L210 123" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="158" y="174" width="84" height="8" rx="4" fill="${accent}" opacity="0.45"/>
      <rect x="172" y="192" width="56" height="6" rx="3" fill="#20322A" opacity="0.25"/>
    `,
    can: `
      <rect x="148" y="80" width="104" height="148" rx="12" fill="white" stroke="${accent}" stroke-width="3"/>
      <ellipse cx="200" cy="80" rx="52" ry="12" fill="${bg}" stroke="${accent}" stroke-width="3"/>
      <rect x="148" y="114" width="104" height="66" fill="${accent}" opacity="0.14"/>
      <circle cx="200" cy="147" r="18" fill="${accent}"/>
      <circle cx="194" cy="143" r="3" fill="white"/>
      <circle cx="206" cy="143" r="3" fill="white"/>
      <path d="M194 154 Q200 160 206 154" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
    `,
    bone: `
      <g transform="rotate(-12 200 148)">
        <rect x="130" y="132" width="140" height="32" rx="10" fill="white" stroke="${accent}" stroke-width="3"/>
        <circle cx="128" cy="130" r="18" fill="white" stroke="${accent}" stroke-width="3"/>
        <circle cx="128" cy="166" r="18" fill="white" stroke="${accent}" stroke-width="3"/>
        <circle cx="272" cy="130" r="18" fill="white" stroke="${accent}" stroke-width="3"/>
        <circle cx="272" cy="166" r="18" fill="white" stroke="${accent}" stroke-width="3"/>
        <rect x="128" y="135" width="144" height="26" fill="white"/>
        <circle cx="200" cy="148" r="7" fill="${accent}" opacity="0.5"/>
      </g>
    `,
    ball: `
      <circle cx="200" cy="148" r="64" fill="white" stroke="${accent}" stroke-width="3.5"/>
      <path d="M148 112 Q200 148 148 184" stroke="${accent}" stroke-width="3" fill="none"/>
      <path d="M252 112 Q200 148 252 184" stroke="${accent}" stroke-width="3" fill="none"/>
      <circle cx="200" cy="148" r="14" fill="${accent}" opacity="0.18"/>
    `,
    collar: `
      <ellipse cx="200" cy="145" rx="68" ry="44" fill="none" stroke="${accent}" stroke-width="14"/>
      <ellipse cx="200" cy="145" rx="68" ry="44" fill="none" stroke="white" stroke-width="3" stroke-dasharray="10 8" opacity="0.6"/>
      <rect x="184" y="180" width="32" height="18" rx="4" fill="#D73F38"/>
      <circle cx="200" cy="210" r="10" fill="white" stroke="${accent}" stroke-width="3"/>
    `,
    bottle: `
      <rect x="166" y="94" width="68" height="136" rx="14" fill="white" stroke="${accent}" stroke-width="3"/>
      <rect x="184" y="64" width="32" height="30" rx="5" fill="${accent}"/>
      <rect x="176" y="54" width="48" height="12" rx="4" fill="#073B2B"/>
      <rect x="178" y="122" width="44" height="68" rx="6" fill="${accent}" opacity="0.14"/>
      <path d="M200 138 C200 138 187 154 187 163 A13 13 0 0 0 213 163 C213 154 200 138 200 138 Z" fill="${accent}"/>
    `,
    bed: `
      <ellipse cx="200" cy="158" rx="84" ry="44" fill="white" stroke="${accent}" stroke-width="3.5"/>
      <ellipse cx="200" cy="154" rx="56" ry="26" fill="${accent}" opacity="0.15" stroke="${accent}" stroke-width="2"/>
      <path d="M120 154 Q200 194 280 154" stroke="${accent}" stroke-width="3" fill="none"/>
    `,
  };

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="${bg}"/>
      <circle cx="200" cy="148" r="96" fill="white" opacity="0.65"/>
      ${icons[iconType]}
      <text x="200" y="264" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#20322A" letter-spacing="1.4" opacity="0.7">${label.toUpperCase()}</text>
      <text x="200" y="281" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="500" fill="#115C39" opacity="0.75">${sublabel}</text>
    </svg>
  `);
}
