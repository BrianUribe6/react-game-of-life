import React, { useEffect, useState } from 'react';
import './game.css';


const SQUARE_SIZE = 32;

function Square({alive}) {
    let background = `bg-${alive ? 'white': 'black'}`
    return (<div className={`square grid-col ${background}`}/>);
}

function countLives(grid, i, j) {
    const m = grid.length;
    const n = grid[0].length;
    let count = 0
    const directions = [
        [1, 0],     //top
        [1, 1],     //top-right
        [0, 1],     //right
        [-1, 1],    //bottom-right
        [-1, 0],    //bottom
        [-1, -1],   //bottom-left
        [0, -1],    //left
        [1, -1],    //top-left
    ]
    for (let dir of directions) {
        const [x, y] = dir;
        const row = i + x;
        const col = j + y;

        if ((row >= 0 && row < m) && (col >= 0 && col < n)) {
            count += grid[row][col];
        }
    }

    return count;
}

function nextState(grid) {
    let m = grid.length;
    let n = grid[0].length;

    let cache = []
    for (let row of grid)   cache.push([...row])

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let lives = countLives(grid, i, j);
            if (grid[i][j] > 0) {
                cache[i][j] = (lives < 2 || lives > 3) ? 0 : 1;
            }
            else {
                cache[i][j] = (lives === 3) ? 1 : 0;
            }
        }
    }

    return cache
}

function initGrid(width, height) {
    let rows = Math.floor(height / SQUARE_SIZE);
    let cols = Math.floor(width / SQUARE_SIZE);
    
    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const life = Math.round(Math.random())
            // console.log(life);
            row.push(life);
        }
        grid.push(row);
    }
    return nextState(grid);
}

function Grid({data}) {
    //console.log(data);
    return (
        <div className="grid">
            {data.map((row) =>(
                <div className="grid-row">
                    {row.map((val) => <Square alive={val > 0}/>)}
                </div>
            ))}
        </div>
    );
}

export function Game(props) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const [grid, setGrid] = useState(initGrid(width, height));

    // useEffect(() => {
    //     const sleep = (time) => new Promise((res) => setTimeout(res, time));
    //     while (true) {
    //         sleep(1 / 60);
    //         setGrid(nextState(grid));
    //     }
    // }, [grid])
    // return "Hello World";
    useEffect(() => {
        const sleep = async (time) => new Promise((resolve) => setTimeout(resolve, time));
        const nextGeneration = async () => {
            await sleep(100);
            setGrid(nextState(grid));
        }
        nextGeneration();
    }, [grid])
    return <Grid data={grid} />;
}