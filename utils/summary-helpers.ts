export const parseSection = (
  section: string,
): { title: string; points: string[] } => {
  const [title, ...content] = section.split('\n');

  const cleanTitle = title.startsWith('#')
    ? title.substring(1).trim()
    : title.trim();

  const points: string[] = [];

  let currentPoint = '';

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith(',')) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = '';
    } else {
      currentPoint += ' ' + trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter((point) => point && !point.startsWith('[Choose]')),
  };
};

export function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = /^\*/.test(point);

  // Détection simplifiée des emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]/u;
  const hasEmoji = emojiRegex.test(point);

  const isEmpty = !point.trim();

  return {
    isNumbered,
    isMainPoint,
    hasEmoji,
    isEmpty,
  };
}

export function parseEmojiPoint(content: string) {
  // Nettoie le contenu en supprimant un éventuel tiret ou point au début + espaces
  const cleanContent = content.replace(/^[•-]\s*/, '').trim();

  // Recherche un motif : un ou plusieurs emojis suivis de texte
  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);

  if (!matches) return null;

  const [, emoji, text] = matches;

  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}
