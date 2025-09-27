'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type MockQRCodeProps = {
  value: string;
  className?: string;
  size?: number;
};

export function MockQRCode({ value, className, size = 128 }: MockQRCodeProps) {
  const modules = useMemo(() => {
    const numModules = 21;
    const grid = Array.from({ length: numModules }, () =>
      Array.from({ length: numModules }, () => false)
    );

    // Super simple pseudo-random generator based on the value string
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = (seed + value.charCodeAt(i)) % 1000;
    }
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Fill with random modules
    for (let y = 0; y < numModules; y++) {
      for (let x = 0; x < numModules; x++) {
        if (random() > 0.5) {
          grid[y][x] = true;
        }
      }
    }

    // Add finder patterns (the squares in the corners)
    const drawFinderPattern = (x: number, y: number) => {
      for (let i = -1; i <= 7; i++) {
        for (let j = -1; j <= 7; j++) {
          if (x + i >= 0 && x + i < numModules && y + j >= 0 && y + j < numModules) {
            if (i === -1 || i === 7 || j === -1 || j === 7) {
              // White border
              grid[y + j][x + i] = false;
            } else if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
              // Black squares
              grid[y + j][x + i] = true;
            } else {
              // White inner part
              grid[y + j][x + i] = false;
            }
          }
        }
      }
    };
    
    drawFinderPattern(0, 0);
    drawFinderPattern(0, numModules - 7);
    drawFinderPattern(numModules - 7, 0);

    return grid;
  }, [value]);

  const moduleSize = size / modules.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('rounded-lg overflow-hidden', className)}
    >
      <rect width={size} height={size} fill="white" />
      {modules.map((row, y) =>
        row.map((isFilled, x) =>
          isFilled ? (
            <rect
              key={`${y}-${x}`}
              x={x * moduleSize}
              y={y * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  );
}
