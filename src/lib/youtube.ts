export interface YoutubeVideo {
  id: string;
  title: string;
}

const UPLOADS_PLAYLIST_ID = "UUGpUiNmBn6BNDn6gFZf_ZrQ";

const FALLBACK_VIDEOS: YoutubeVideo[] = [
  { id: "LVCKZ2Ou1fE", title: "발바닥 통증의 진짜 해법! 족저근막염 치료" },
  { id: "kQ0PtqhoqEY", title: "아킬레스건 통증! 꼭 치료해야 하는 이유" },
  { id: "BI2kzHjt-ko", title: "무릎 통증 비싼 연골주사 말고 진짜 치료 방법" },
  { id: "IveqAQcg9zo", title: "이상근 증후군 좌골신경통증 다리저림 해결" },
  { id: "2F7Sr5vL7zs", title: "허리통증, 다리저림, 허리협착증 해결법" },
  { id: "w8a7HXqMSVI", title: "허리 아픈 사람 99%가 모르는 장요근의 비밀" },
  { id: "8NEzNCxkCGQ", title: "오십견 잘못 스트레칭하면 어깨가 10년 늙습니다" },
  { id: "mFvI91OAYe4", title: "살 빠지는 뇌로 바뀌는 다이어트 방법" },
];

interface PlaylistItemsResponse {
  items?: Array<{
    snippet?: {
      title?: string;
      resourceId?: { videoId?: string };
    };
  }>;
}

export async function fetchLatestVideos(limit = 20): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return FALLBACK_VIDEOS.slice(0, limit);

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", UPLOADS_PLAYLIST_ID);
    url.searchParams.set("maxResults", String(Math.min(limit, 50)));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return FALLBACK_VIDEOS.slice(0, limit);

    const data = (await res.json()) as PlaylistItemsResponse;
    const videos: YoutubeVideo[] = (data.items ?? [])
      .map((it) => ({
        id: it.snippet?.resourceId?.videoId ?? "",
        title: it.snippet?.title ?? "",
      }))
      .filter((v) => v.id.length > 0 && v.title.length > 0 && v.title !== "Private video" && v.title !== "Deleted video");

    return videos.length > 0 ? videos.slice(0, limit) : FALLBACK_VIDEOS.slice(0, limit);
  } catch {
    return FALLBACK_VIDEOS.slice(0, limit);
  }
}
