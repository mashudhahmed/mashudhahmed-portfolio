'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from './CountUp';

interface GitHubStreakProps {
  username: string;
  fallback?: number;
}

export default function GitHubStreak({ username, fallback = 7 }: GitHubStreakProps) {
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    // ✅ Only fetch if in view and not already fetched
    if (inView && streak === null && !error) {
      fetchGitHubStreak(username)
        .then(longestStreak => {
          setStreak(longestStreak);
        })
        .catch(() => {
          setError(true);
          setStreak(fallback);
        });
    }
  }, [inView, username, streak, error, fallback]);

  if (streak === null) {
    return <span ref={ref}>—</span>;
  }

  return (
    <span ref={ref}>
      <CountUp end={streak} suffix=" days" />
    </span>
  );
}

async function fetchGitHubStreak(username: string): Promise<number> {
  try {
    // ✅ Use GitHub's GraphQL API with caching
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch streak data');
    }
    
    const data = await response.json();
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    const contributions = data.contributions || [];
    
    for (const day of contributions) {
      if (day.count > 0) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak || 0;
  } catch (error) {
    console.error('Failed to fetch GitHub streak:', error);
    return fetchStreakFromGitHubAPI(username);
  }
}

async function fetchStreakFromGitHubAPI(username: string): Promise<number> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add token for higher rate limit
        // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }

    const data = await response.json();
    
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          currentStreak++;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      }
    }
    
    return longestStreak;
  } catch (error) {
    console.error('All GitHub API attempts failed:', error);
    return 7; // Default fallback
  }
}