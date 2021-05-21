// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from './02'

function Board() {
  const [state, setState] = useLocalStorageState('state', {
    squares: Array(9).fill(null),
  })

  // Derived state this is as slick as it gets
  // using derived state we don't have to create a state for each and every
  // variable used in the component

  const nextValue = calculateNextValue(state.squares)
  const winner = calculateWinner(state.squares)
  const status = calculateStatus(winner, state.squares, nextValue)

  // this works because all of the values depend only on square
  // and are updated every time square is changed

  const [tic_history, setHistory] = useLocalStorageState('tic_history', {
    data: [],
  })

  function selectSquare(square) {
    if (winner) return
    if (state.squares[square]) return

    const newSquares = [...state.squares]
    newSquares[square] = nextValue
    setState({
      squares: newSquares,
    })
    setHistory(prev => ({
      ...prev,
      data: [
        ...prev.data,
        {
          squares: newSquares,
        },
      ],
    }))
  }

  function restart() {
    setState({
      squares: Array(9).fill(null),
    })
    setHistory({data: []})
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {state.squares[i]}
      </button>
    )
  }
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <div>
        {tic_history.data.map((item, index) => {
          const isCurrent = JSON.stringify(item) === JSON.stringify(state)
          const desc =
            index === 0 ? `Go to game start` : `Go to step ${index + 1}`
          return (
            <div style={{opacity: isCurrent ? 0.5 : 1}}>
              <button
                onClick={() => {
                  setState(item)
                }}
              >
                {desc}
                {isCurrent ? '(current)' : ''}
              </button>{' '}
            </div>
          )
        })}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
