import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'joshua-lossner'; // This would be your actual GitHub username
const REPO_NAME = 'lossner.personal';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const directory = searchParams.get('directory');
    const file = searchParams.get('file');

    if (file && directory) {
      // Fetch specific file content
      return await fetchFileContent(directory, file);
    } else if (directory) {
      // Fetch directory listing
      return await fetchDirectoryListing(directory);
    } else {
      // Fetch root directories
      return await fetchRootDirectories();
    }
  } catch (error: any) {
    console.error('Content API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

async function fetchRootDirectories() {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/content`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  const directories = data
    .filter((item: any) => item.type === 'dir')
    .map((item: any) => ({
      name: item.name,
      path: item.path
    }));

  return NextResponse.json({ directories });
}

async function fetchDirectoryListing(directory: string) {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/${directory}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  const files = await Promise.all(
    data
      .filter((item: any) => item.type === 'file' && item.name.endsWith('.md'))
      .map(async (item: any) => {
        // Fetch file content to extract frontmatter
        const fileResponse = await fetch(item.download_url);
        const content = await fileResponse.text();
        
        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/);
        let title = item.name.replace('.md', '');
        let order = 999;
        let metadata: any = {};
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const bodyContent = frontmatterMatch[2];
          
          // Extract metadata from frontmatter
          const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
          const orderMatch = frontmatter.match(/order:\s*(\d+)/);
          const companyMatch = frontmatter.match(/company:\s*"?([^"\n]+)"?/);
          const periodMatch = frontmatter.match(/period:\s*"?([^"\n]+)"?/);
          
          if (titleMatch) title = titleMatch[1];
          if (orderMatch) order = parseInt(orderMatch[1]);
          if (companyMatch) metadata.company = companyMatch[1];
          if (periodMatch) metadata.period = periodMatch[1];
        }
        
        return {
          name: item.name,
          title,
          order,
          metadata,
          downloadUrl: item.download_url
        };
      })
  );

  // Sort by order, then by title
  files.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return NextResponse.json({ files });
}

async function fetchFileContent(directory: string, filename: string) {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/${directory}/${filename}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  const fileResponse = await fetch(data.download_url);
  const content = await fileResponse.text();
  
  // Parse frontmatter and content
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/);
  let title = filename.replace('.md', '');
  let bodyContent = content;
  let metadata: any = {};
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    bodyContent = frontmatterMatch[2];
    
    // Extract all frontmatter fields
    const frontmatterLines = frontmatter.split('\n');
    frontmatterLines.forEach(line => {
      const match = line.match(/^(\w+):\s*"?([^"\n]+)"?$/);
      if (match) {
        const [, key, value] = match;
        if (key === 'title') title = value;
        else metadata[key] = value;
      }
    });
  }
  
  return NextResponse.json({
    title,
    content: bodyContent,
    metadata,
    filename
  });
}