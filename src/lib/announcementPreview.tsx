// Helper to extract preview from rich content// Updated helper — handles both JSON block format AND plain HTML string
export function getAnnouncementPreview(content: string): {
  text: string;
  imageUrl: string | null;
} {
  try {
    const blocks = JSON.parse(content);
    if (Array.isArray(blocks)) {
      const textBlock = blocks.find((b: any) => b.type === "text" && b.content);
      const imageBlock = blocks.find(
        (b: any) => b.type === "images" && b.images?.length > 0,
      );
      const text = (textBlock?.content ?? "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      return { text, imageUrl: imageBlock?.images?.[0]?.url ?? null };
    }
  } catch {}

  // Fallback: plain HTML string — extract text and first img src
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  const text = content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return { text, imageUrl: imgMatch?.[1] ?? null };
}
