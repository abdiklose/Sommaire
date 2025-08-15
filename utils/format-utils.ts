export function formatFileNameAsTitle(fileName: string): string {
  // Supprimer l'extension du fichier
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");

  // Remplacer les underscores et tirets par des espaces
  // et ajouter un espace entre les mots en camelCase
  const withSpaces = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  // Mettre en majuscule la première lettre de chaque mot
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
