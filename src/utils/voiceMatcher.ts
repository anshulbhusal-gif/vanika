/**
 * Reusable Voice Answer Matching Utility for Cognitive Games
 * Normalizes transcripts, strips harmless filler phrases, and performs
 * multi-strategy fuzzy matching (Exact, Substring, Word Overlap, Levenshtein Distance).
 */

const FILLER_PHRASES = [
  'i think it is',
  'i think its',
  'i think',
  'the answer is',
  'the answer',
  'my answer is',
  'i choose',
  'i pick',
  'select',
  'it is',
  'its a',
  'it is a',
  'option',
  'number',
  'picture of',
  'photo of',
];

/**
 * Normalizes input text by lowercasing, stripping punctuation,
 * collapsing whitespace, and removing common harmless spoken prefix phrases.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  let str = text.toLowerCase().trim();
  // Strip punctuation
  str = str.replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '');
  // Collapse whitespace
  str = str.replace(/\s+/g, ' ');

  // Strip filler prefix phrases
  for (const filler of FILLER_PHRASES) {
    if (str.startsWith(filler + ' ')) {
      str = str.slice(filler.length).trim();
      break;
    }
  }

  return str;
}

/**
 * Computes Levenshtein edit distance between two normalized strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates a normalized similarity score (0.0 to 1.0) between a spoken transcript and an option text.
 */
export function calculateSimilarity(transcript: string, option: string): number {
  const normTranscript = normalizeText(transcript);
  const normOption = normalizeText(option);

  if (!normTranscript || !normOption) return 0;

  // 1. Exact match after normalization
  if (normTranscript === normOption) return 1.0;

  // 2. Substring containment match
  if (normTranscript.includes(normOption)) {
    const ratio = normOption.length / normTranscript.length;
    return Math.max(0.85, ratio);
  }
  if (normOption.includes(normTranscript)) {
    const ratio = normTranscript.length / normOption.length;
    return Math.max(0.75, ratio);
  }

  // 3. Word overlap match
  const transcriptWords = normTranscript.split(' ').filter((w) => w.length > 2);
  const optionWords = normOption.split(' ').filter((w) => w.length > 2);

  if (optionWords.length > 0 && transcriptWords.length > 0) {
    const matchingWords = optionWords.filter((ow) =>
      transcriptWords.some((tw) => tw.includes(ow) || ow.includes(tw))
    );
    const wordOverlapScore = matchingWords.length / optionWords.length;

    if (wordOverlapScore >= 0.75) {
      return 0.8 + wordOverlapScore * 0.15;
    }
  }

  // 4. Levenshtein edit distance similarity
  const maxLen = Math.max(normTranscript.length, normOption.length);
  const dist = levenshteinDistance(normTranscript, normOption);
  const levSimilarity = 1 - dist / maxLen;

  return Math.max(0, levSimilarity);
}

export interface VoiceMatchDetails {
  bestMatch: string | null;
  confidence: number;
  transcript: string;
}

/**
 * Finds the best matching option for a spoken transcript given a list of options.
 * Returns the matching option string if confidence >= threshold (default 0.6), otherwise returns null.
 */
export function findBestMatchingOption(
  transcript: string,
  options: string[],
  threshold: number = 0.6
): string | null {
  const details = findBestMatchingOptionWithDetails(transcript, options, threshold);
  return details.bestMatch;
}

/**
 * Detailed version of findBestMatchingOption returning confidence score.
 */
export function findBestMatchingOptionWithDetails(
  transcript: string,
  options: string[],
  threshold: number = 0.6
): VoiceMatchDetails {
  if (!transcript || !options || options.length === 0) {
    return { bestMatch: null, confidence: 0, transcript: transcript || '' };
  }

  let bestOption: string | null = null;
  let highestScore = 0;

  for (const option of options) {
    const score = calculateSimilarity(transcript, option);
    if (score > highestScore) {
      highestScore = score;
      bestOption = option;
    }
  }

  if (highestScore >= threshold && bestOption !== null) {
    return { bestMatch: bestOption, confidence: highestScore, transcript };
  }

  return { bestMatch: null, confidence: highestScore, transcript };
}
