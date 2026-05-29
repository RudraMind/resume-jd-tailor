const REPLACEMENTS = {
  'spearheaded': 'led', 'orchestrated': 'coordinated', 'championed': 'advocated for',
  'synergized': 'collaborated', 'leveraged': 'used', 'revolutionized': 'transformed',
  'pioneered': 'introduced', 'catalyzed': 'initiated', 'operationalized': 'implemented',
  'architected': 'designed', 'envisioned': 'planned', 'effectuated': 'completed',
  'endeavored': 'worked', 'facilitated': 'helped', 'utilized': 'used',
  'synergy': 'collaboration', 'paradigm shift': 'change', 'paradigm': 'approach',
  'best-in-class': 'top-performing', 'world-class': 'high-quality',
  'cutting-edge': 'modern', 'bleeding-edge': 'modern',
  'game-changing': 'significant', 'game-changer': 'significant improvement',
  'disruptive': 'innovative', 'holistic': 'comprehensive',
  'robust': 'strong', 'scalable': 'expandable', 'actionable': 'practical',
  'impactful': 'effective', 'proactively': 'actively', 'proactive': 'active',
  'deliverables': 'outputs', 'bandwidth': 'capacity',
  'deep dive': 'analysis', 'move the needle': 'make progress',
  'low-hanging fruit': 'quick wins', 'value-add': 'benefit',
  'in order to': 'to', 'for the purpose of': 'to', 'with a view to': 'to',
  'at the end of the day': '', 'moving forward': '', 'going forward': '',
  'on a daily basis': 'daily', 'on a regular basis': 'regularly',
  'in a timely manner': 'promptly', 'at this point in time': 'now',
  'due to the fact that': 'because', 'in the event that': 'if',
  'in light of the fact that': 'since',
  '—': ', ', '---': ', ', '--': ', ',
};

export function cleanAIPhrases(bullets, jdText = '') {
  const jdLower = jdText.toLowerCase();
  const sorted = Object.keys(REPLACEMENTS).sort((a, b) => b.length - a.length);
  const allReplacements = [];

  const cleaned = bullets.map(bullet => {
    let text = bullet.rewritten || bullet;
    const bulletReplacements = [];

    for (const phrase of sorted) {
      if (jdLower.includes(phrase.toLowerCase())) continue;

      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(text)) {
        bulletReplacements.push({ original: phrase, replacement: REPLACEMENTS[phrase] });
        text = text.replace(regex, REPLACEMENTS[phrase]);
      }
    }

    text = text.replace(/\s{2,}/g, ' ').trim();
    if (bulletReplacements.length > 0) allReplacements.push(...bulletReplacements);

    return { ...bullet, cleaned: text, phraseReplacements: bulletReplacements };
  });

  return { cleaned, replacements: allReplacements, count: allReplacements.length };
}
