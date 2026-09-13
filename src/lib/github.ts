export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
}

export async function fetchRepos(username: string, limit = 6): Promise<GithubRepo[]> {
  if (!username || username === "your-github-username") return [];
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
    { next: { revalidate: 3600 } as RequestInit as object } as RequestInit
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return (await res.json()) as GithubRepo[];
}
