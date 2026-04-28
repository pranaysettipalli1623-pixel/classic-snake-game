import React, { useState, useEffect, useCallback } from 'react';
import { Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      if (isGameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120); // Game speed
    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="flex justify-between w-full max-w-[400px] mb-6 font-mono text-cyan-400">
        <div className="flex items-center gap-2 text-xl font-bold tracking-wider">
          <span className="opacity-50">SCORE</span>
          <span className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="text-sm opacity-60 flex items-center">
          {isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      <div 
        className="game-board relative grid gap-0 border-2 border-cyan-500/30 rounded-lg p-1 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-black/60"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'clamp(280px, 60vw, 400px)',
          height: 'clamp(280px, 60vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isFood = food.x === x && food.y === y;
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);

          return (
            <div
              key={index}
              className={`w-full h-full rounded-sm transition-all duration-75 ${
                isSnakeHead
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10'
                  : isSnakeBody
                  ? 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.6)]'
                  : isFood
                  ? 'bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)] scale-110 rotate-45 z-10'
                  : 'bg-transparent'
              }`}
            />
          );
        })}

        {isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
            <h2 className="text-4xl font-black text-rose-500 mb-2 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse">
              GAME OVER
            </h2>
            <p className="text-cyan-400 font-mono mb-6">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-white/40 font-mono flex gap-4">
        <span>Use Arrow Keys or WASD to move</span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
}
