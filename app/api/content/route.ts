import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = process.env.GITHUB_OWNER || 'joshua-lossner';
const REPO_NAME = process.env.GITHUB_REPO || 'lossner.personal';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const directory = searchParams.get('directory');
    const file = searchParams.get('file');

    console.log('Content API called:', { directory, file, hasToken: !!GITHUB_TOKEN });

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
      { 
        error: 'Failed to fetch content',
        details: error.message,
        hasToken: !!GITHUB_TOKEN,
        repo: `${REPO_OWNER}/${REPO_NAME}`
      },
      { status: 500 }
    );
  }
}

async function fetchRootDirectories() {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/content`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'lossner-tech-website'
  };
  
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    // If GitHub API fails (likely due to private repo without auth), return fallback directory structure
    if (response.status === 404 || response.status === 403) {
      console.log('GitHub API failed, returning fallback directories');
      return NextResponse.json({ 
        directories: [
          { name: 'Experience', path: 'content/Experience' },
          { name: 'Skills', path: 'content/Skills' },
          { name: 'Projects', path: 'content/Projects' },
          { name: 'Education', path: 'content/Education' },
          { name: 'Journal', path: 'content/Journal' },
          { name: 'About', path: 'content/About' }
        ]
      });
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
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
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'lossner-tech-website'
  };
  
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    // If GitHub API fails, return fallback content for directory
    if (response.status === 404 || response.status === 403) {
      console.log(`GitHub API failed for directory ${directory}, returning fallback content`);
      return getFallbackDirectoryContent(directory);
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
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
          const statusMatch = frontmatter.match(/status:\s*"?([^"\n]+)"?/);
          const timelineMatch = frontmatter.match(/timeline:\s*"?([^"\n]+)"?/);
          
          if (titleMatch) title = titleMatch[1];
          if (orderMatch) order = parseInt(orderMatch[1]);
          if (companyMatch) metadata.company = companyMatch[1];
          if (periodMatch) metadata.period = periodMatch[1];
          if (statusMatch) metadata.status = statusMatch[1];
          if (timelineMatch) metadata.timeline = timelineMatch[1];
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

  // Sort files based on directory type
  if (directory === 'Projects') {
    // For Projects, sort by status (In Progress first), then by timeline/period (most recent first)
    files.sort((a, b) => {
      // First priority: In Progress status
      const aInProgress = a.metadata?.status?.toLowerCase() === 'in progress';
      const bInProgress = b.metadata?.status?.toLowerCase() === 'in progress';
      
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      
      // Second priority: Sort by timeline or period (most recent first)
      const aDate = extractProjectDate(a.metadata?.timeline || a.metadata?.period || '');
      const bDate = extractProjectDate(b.metadata?.timeline || b.metadata?.period || '');
      
      if (aDate !== bDate) return bDate - aDate; // Most recent first
      
      // Fallback to order, then title
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  } else {
    // For other directories, sort by order, then by title
    files.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  }

  return NextResponse.json({ files });
}

async function fetchFileContent(directory: string, filename: string) {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/${directory}/${filename}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'lossner-tech-website'
  };
  
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    // If GitHub API fails, return fallback content for file
    if (response.status === 404 || response.status === 403) {
      console.log(`GitHub API failed for file ${directory}/${filename}, returning fallback content`);
      return getFallbackFileContent(directory, filename);
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
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

// Fallback content when GitHub API is not accessible
function getFallbackDirectoryContent(directory: string) {
  const fallbackData: Record<string, any[]> = {
    'Experience': [
      {
        name: 'grinnell-mutual-devops-engineer.md',
        title: 'DevOps Engineer',
        order: 1,
        metadata: { company: 'Grinnell Mutual Insurance', period: 'June 2022 - Present' },
        downloadUrl: null
      },
      {
        name: 'mumo-systems-senior-solutions-consultant.md',
        title: 'Senior Solutions Consultant',
        order: 2,
        metadata: { company: 'Mumo Systems', period: 'June 2021 - June 2022' },
        downloadUrl: null
      }
    ],
    'Skills': [
      {
        name: 'release-management-automation.md',
        title: 'Release Management and Automation',
        order: 1,
        metadata: { category: 'Core Competency' },
        downloadUrl: null
      },
      {
        name: 'system-administration-infrastructure.md',
        title: 'System Administration and IT Infrastructure',
        order: 2,
        metadata: { category: 'Core Competency' },
        downloadUrl: null
      }
    ],
    'Projects': [
      {
        name: 'devflow-cli.md',
        title: 'DevFlow CLI',
        order: 1,
        metadata: { status: 'Active', timeline: 'Present' },
        downloadUrl: null
      },
      {
        name: 'atlassian-enterprise-migration.md',
        title: 'Atlassian Server to Data Center Migration',
        order: 2,
        metadata: { company: 'Berkley Technology Services', period: '2020-2021', status: 'Completed' },
        downloadUrl: null
      },
      {
        name: 'servicenow-atlassian-integration.md',
        title: 'ServiceNow-Atlassian Integration',
        order: 3,
        metadata: { period: '2018-2020', status: 'Completed' },
        downloadUrl: null
      }
    ],
    'Education': [
      {
        name: 'university-phoenix-masters.md',
        title: 'Master of Science in Information Technology',
        order: 1,
        metadata: { institution: 'University of Phoenix Online', period: 'September 2008 - May 2010' },
        downloadUrl: null
      }
    ],
    'Journal': [
      {
        name: 'enterprise-automation-lessons.md',
        title: 'Lessons from Managing 18,000+ Annual Deployments',
        order: 1,
        metadata: { date: '2023-11-15', category: 'Enterprise Automation' },
        downloadUrl: null
      }
    ],
    'About': [
      {
        name: 'joshua-lossner-profile.md',
        title: 'About Joshua Lossner',
        order: 1,
        metadata: { category: 'Professional Profile' },
        downloadUrl: null
      }
    ]
  };

  let files = fallbackData[directory] || [];
  
  // Apply the same sorting logic as the main function
  if (directory === 'Projects') {
    // For Projects, sort by status (In Progress first), then by timeline/period (most recent first)
    files.sort((a, b) => {
      // First priority: In Progress status
      const aInProgress = a.metadata?.status?.toLowerCase() === 'in progress';
      const bInProgress = b.metadata?.status?.toLowerCase() === 'in progress';
      
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      
      // Second priority: Sort by timeline or period (most recent first)
      const aDate = extractProjectDate(a.metadata?.timeline || a.metadata?.period || '');
      const bDate = extractProjectDate(b.metadata?.timeline || b.metadata?.period || '');
      
      if (aDate !== bDate) return bDate - aDate; // Most recent first
      
      // Fallback to order, then title
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  }
  
  return NextResponse.json({ files });
}

// Helper function to extract end date from project timeline/period for sorting
function extractProjectDate(dateStr: string): number {
  if (!dateStr) return 0;
  
  // Handle "Active" or "In Progress" status - treat as current time
  if (dateStr.toLowerCase().includes('active') || dateStr.toLowerCase().includes('in progress')) {
    return Date.now();
  }
  
  // Handle "Present" case - return current time
  if (dateStr.toLowerCase().includes('present')) {
    return Date.now();
  }
  
  // Extract years from formats like "2020-2021" or "2020 - 2021" or just "2021"
  const yearMatches = dateStr.match(/\d{4}/g);
  if (yearMatches && yearMatches.length > 0) {
    // Get the last (most recent) year
    const lastYear = yearMatches[yearMatches.length - 1];
    // Use December 31st of that year for sorting
    return new Date(`December 31, ${lastYear}`).getTime();
  }
  
  // Fallback: try to parse as-is
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? 0 : date.getTime();
}

function getFallbackFileContent(directory: string, filename: string) {
  // Return a placeholder message indicating the content will be available once GitHub token is configured
  const title = filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const content = `# ${title}

Content loading requires GitHub API authentication. 

To enable dynamic content loading from the lossner.personal repository:

1. Create a GitHub Personal Access Token with repository access
2. Add the token to your environment variables as \`GITHUB_TOKEN\`
3. Restart the development server

**Repository**: ${REPO_OWNER}/${REPO_NAME}  
**File**: content/${directory}/${filename}

Once configured, this content will be dynamically loaded from the private repository containing your professional portfolio data.`;

  return NextResponse.json({
    title,
    content,
    metadata: {
      status: 'fallback',
      directory,
      filename
    },
    filename
  });
}