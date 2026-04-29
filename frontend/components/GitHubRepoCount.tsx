'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from './CountUp';

interface GitHubRepoCountProps {
  username: string;
  fallback?: number;
}

export default function GitHubRepoCount({ username, fallback = 24 }: GitHubRepoCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView && count === null && !error) {
      fetch(`https://api.github.com/users/${username}`)
        .then(res => {
          if (!res.ok) throw new Error('GitHub API error');
          return res.json();
        })
        .then(data => {
          if (data.public_repos !== undefined) {
            setCount(data.public_repos);
          } else {
            setCount(fallback);
          }
        })
        .catch(() => {
          setError(true);
          setCount(fallback);
        });
    }
  }, [inView, username, count, error, fallback]);

  if (count === null) {
    return <span ref={ref}>—</span>;
  }

  return (
    <span ref={ref}>
      <CountUp end={count} suffix="" />
    </span>
  );
}