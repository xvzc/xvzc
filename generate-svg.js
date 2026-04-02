import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Import fetcher and renderer from local copies
import { fetchStats } from './src/fetchers/stats.js';
import { renderStatsCard } from './src/cards/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  const username = "xvzc";

  if (!process.env.PAT_1) {
    console.warn("WARNING: process.env.PAT_1 is not set! Fetching from GitHub API might hit rate limits or fail without a Personal Access Token.");
  } else {
    console.log("Using provided PAT for GitHub API.");
  }

  console.log(`Fetching stats for GitHub user: ${username}...`);
  try {
    // 1. Fetch live data for the user 'xvzc'
    // fetchStats(username, include_all_commits, exclude_repos, show_prs_merged, show_discussions_started, show_discussions_answered, commits_year)
    const stats = await fetchStats(username, true, [], true, true, true);
    
    console.log("Data fetched successfully. Rendering SVG...");

    // 2. Setup rendering options
    const options = {
      show_icons: true,
      theme: "dark", // e.g. dark, radical, default, etc.
      hide_border: false,
      hide_rank: false,
      show: ["prs_merged"]
    };

    // 3. Render the SVG string
    const svg = renderStatsCard(stats, options);

    // 4. Save directly into xvzc folder
    const outputPath = path.join(__dirname, 'stats.svg');
    fs.writeFileSync(outputPath, svg, 'utf8');
    
    console.log(`Successfully generated SVG at: ${outputPath}`);
  } catch (error) {
    console.error("Error generating SVG:", error.message);
  }
}

generate();
