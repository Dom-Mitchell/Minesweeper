import React, { useEffect, useState } from 'react'
import useSound from 'use-sound'
// import monk from './icons/footer/favicon.svg'
import mainSound from './mp3s/minesweeper.mp3'

type GameDifficulty = 0 | 1 | 2

export function App() {
  const [game, setGame] = useState({
    id: undefined,
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    state: undefined,
    mines: undefined,
  })
  const [difficulty, setDifficulty] = useState<GameDifficulty>(0)

  useEffect(function () {
    async function loadExistingGame() {
      const existingGameId = localStorage.getItem('game-id')
      const existingDifficulty = localStorage.getItem('game-difficulty')

      if (existingGameId && existingDifficulty) {
        const response = await fetch(
          `http://minesweeper-api.herokuapp.com/games/${existingGameId}`
        )

        if (response.ok) {
          const gameJson = await response.json()

          setGame(gameJson)
          setDifficulty(Number(existingDifficulty) as GameDifficulty)
        }
      }
    }

    loadExistingGame()
  }, [])

  const gameSound = mainSound

  const startSound = () => {
    const [play] = useSound(gameSound)
  }

  async function newGame(newGameDifficulty: 0 | 1 | 2) {
    const gameOptions = { difficulty: newGameDifficulty }

    const url = 'https://minesweeper-api.herokuapp.com/games'

    const fetchOptions = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(gameOptions),
    }

    const response = await fetch(url, fetchOptions)

    console.log(response)

    if (response.ok) {
      // What to do if the response is ok
      const newGameStateJson = await response.json()

      setDifficulty(newGameDifficulty)
      setGame(newGameStateJson)
      localStorage.setItem('game-id', newGameStateJson.id)
      localStorage.setItem('game-difficulty', String(newGameDifficulty))
    }
    play()
  }

  async function handleCheckOrFlagCell(
    row: number,
    col: number,
    action: 'check' | 'flag'
  ) {
    const checkOptions = {
      id: game.id,
      row,
      col,
    }

    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/${action}`
    const fetchOptions = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(checkOptions),
    }

    const response = await fetch(url, fetchOptions)

    if (response.ok) {
      const newGameStateJson = await response.json()

      setGame(newGameStateJson)
    }
  }

  function transformCellValue(value: string) {
    if (value === 'F') {
      // return an icon for a flag
      return (
        <>
          <audio className="flagging" src="audio">
            <track kind="captions"> </track>
            <svg
              version="1.1"
              id="Flag"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512.004 512.004"
              fill="enable-background:new 0 0 512.004 512.004;"
              xmlSpace="preserve"
            >
              <path
                fill="#E64C3C"
                d="M365.452,308.98c-35.723,0.724-70.246-12.958-95.774-37.957c-22.209-21.6-52.177-33.375-83.152-32.66
	c-26.075-0.344-51.559,7.839-72.559,23.304c-2.675,2.092-5.958,3.24-9.357,3.266c-4.546-0.035-8.854-2.03-11.828-5.473
	c-2.957-3.398-4.555-7.768-4.502-12.27V48.314c0-4.864,1.942-9.533,5.385-12.976c25.316-23.18,58.542-35.812,92.861-35.309
	c35.785-0.759,70.37,12.914,95.951,37.957c22.156,21.574,52.054,33.34,82.975,32.66c21.265,0.194,42.22-5.129,60.819-15.447
	c2.322-1.395,4.97-2.154,7.68-2.207c9.339,0.433,16.595,8.306,16.242,17.654v200.817c0.168,5.967-2.692,11.608-7.591,15.006
	C419.686,301.468,392.834,309.306,365.452,308.98z"
              />
              <path
                fill="#CBB292"
                d="M79.453,0.03L79.453,0.03c9.754,0,17.654,7.9,17.654,17.654v476.665
	c0,9.754-7.9,17.654-17.654,17.654l0,0c-9.754,0-17.654-7.9-17.654-17.654V17.684C61.799,7.939,69.699,0.03,79.453,0.03z"
              />
            </svg>
          </audio>
        </>
      )
    }

    if (value === '_') {
      // return an empty square
      return ' '
    }

    if (value === '*') {
      // return an icon for a bomb
      return (
        <svg
          height="512pt"
          viewBox="0 0 512 512"
          width="512pt"
          xmlns="http://www.w3.org/2000/svg"
          id="Bomb"
        >
          <path
            d="m195.671875 128.15625c25.660156 0 50.117187 5.144531 72.40625 14.445312l-12.960937-47.496093c-1.109376-4.070313-4.808594-6.894531-9.027344-6.894531h-100.835938c-4.222656 0-7.917968 2.824218-9.03125 6.894531l-12.957031 47.496093c22.289063-9.300781 46.746094-14.445312 72.40625-14.445312zm0 0"
            fill="#4172cc"
          />
          <path
            d="m437.292969 62.703125c-6.902344 0-12.5 5.597656-12.5 12.5v27.152344c0 3.285156-.371094 6.484375-1.054688 9.570312-4.386719 19.808594-22.082031 34.671875-43.191406 34.671875-24.394531 0-44.242187-19.847656-44.242187-44.242187v-21.785157c0-40.292968-32.78125-73.070312-73.070313-73.070312h-18.820313c-33.769531 0-61.242187 27.472656-61.242187 61.242188v19.46875h25v-19.46875c0-19.984376 16.257813-36.242188 36.242187-36.242188h18.820313c26.503906 0 48.070313 21.5625 48.070313 48.070312v21.785157c0 38.179687 31.0625 69.242187 69.242187 69.242187 23.550781 0 44.378906-11.824218 56.894531-29.835937 7.777344-11.195313 12.351563-24.773438 12.351563-39.40625v-27.152344c0-6.902344-5.597657-12.5-12.5-12.5zm0 0"
            fill="#fff2b2"
          />
          <path
            d="m195.671875 120.65625c-107.894531 0-195.671875 87.78125-195.671875 195.671875 0 107.894531 87.777344 195.671875 195.671875 195.671875 107.890625 0 195.671875-87.777344 195.671875-195.671875 0-107.890625-87.78125-195.671875-195.671875-195.671875zm0 0"
            fill="#6990d7"
          />
          <path
            d="m262.332031 132.351562c53.546875 34.949219 89.011719 95.398438 89.011719 163.976563 0 107.894531-87.78125 195.671875-195.671875 195.671875-23.398437 0-45.847656-4.128906-66.660156-11.691406 30.699219 20.035156 67.34375 31.691406 106.660156 31.691406 107.890625 0 195.671875-87.777344 195.671875-195.671875 0-84.496094-53.839844-156.65625-129.011719-183.976563zm0 0"
            fill="#4172cc"
          />
          <path
            d="m500 63.03125c-3.820312-1.867188-9.804688-4.484375-17.691406-7.019531 3.785156-7.371094 6.164062-13.457031 7.542968-17.476563 2.929688-8.523437 3.710938-13.191406.230469-16.667968-3.476562-3.480469-8.144531-2.699219-16.667969.230468-4.019531 1.382813-10.105468 3.757813-17.476562 7.546875-2.53125-7.890625-5.152344-13.875-7.019531-17.695312-3.957031-8.097657-6.703125-11.949219-11.625-11.949219-4.917969 0-7.664063 3.851562-11.621094 11.949219-1.867187 3.820312-4.488281 9.804687-7.023437 17.691406-7.371094-3.785156-13.453126-6.164063-17.476563-7.542969-8.519531-2.925781-13.1875-3.710937-16.667969-.230468-3.476562 3.480468-2.695312 8.144531.230469 16.667968 1.382813 4.023438 3.757813 10.105469 7.546875 17.476563-7.890625 2.535156-13.875 5.15625-17.695312 7.023437-8.097657 3.953125-11.949219 6.703125-11.949219 11.621094s3.851562 7.667969 11.949219 11.625c3.820312 1.867188 9.804687 4.488281 17.695312 7.019531-3.789062 7.371094-6.164062 13.457031-7.546875 17.476563-2.925781 8.523437-3.707031 13.191406-.230469 16.667968 3.480469 3.480469 8.148438 2.699219 16.667969-.230468 4.023437-1.378906 10.105469-3.757813 17.476563-7.542969 2.535156 7.886719 5.15625 13.871094 7.023437 17.691406 3.957031 8.097657 6.703125 11.949219 11.621094 11.949219 4.921875 0 7.667969-3.851562 11.625-11.949219 1.867187-3.820312 4.488281-9.804687 7.019531-17.691406 7.371094 3.785156 13.457031 6.164063 17.476562 7.542969 8.523438 2.929687 13.191407 3.710937 16.667969.230468 3.480469-3.476562 2.699219-8.144531-.230469-16.667968-1.378906-4.019532-3.757812-10.105469-7.542968-17.476563 7.886718-2.535156 13.871094-5.15625 17.691406-7.019531 8.097656-3.957031 11.949219-6.707031 11.949219-11.625s-3.851563-7.667969-11.949219-11.625zm0 0"
            fill="#eb5793"
          />
          <path
            d="m449.792969 102.355469v-27.152344c0-6.902344-5.597657-12.5-12.5-12.5-6.902344 0-12.5 5.597656-12.5 12.5v27.152344c0 3.285156-.371094 6.484375-1.054688 9.570312-.855469 3.867188-2.21875 7.546875-4.015625 10.964844 2.183594 6.3125 4.34375 11.191406 5.949219 14.472656 2.546875 5.210938 4.589844 8.664063 7.039063 10.464844 1.683593-1.929687 3.265624-3.957031 4.730468-6.066406 7.777344-11.195313 12.351563-24.773438 12.351563-39.40625zm0 0"
            fill="#e7387f"
          />
          <path
            d="m289.835938 329.191406 2.542968-34.511718c4.160156-56.542969-38.792968-104.519532-95.488281-105.210938-56.980469-.699219-102.175781 47.507812-98.003906 104.164062l2.621093 35.558594c.320313 4.367188-1.667968 8.617188-5.300781 11.054688-5.046875 3.386718-8.367187 9.140625-8.367187 15.671875 0 10.417969 8.445312 18.859375 18.859375 18.859375h20c7.941406 0 14.65625 5.890625 15.6875 13.765625l6.113281 46.546875c.609375 4.640625 4.5625 8.109375 9.242188 8.109375h75.859374c4.679688 0 8.632813-3.46875 9.242188-8.109375l6.109375-46.546875c1.035156-7.875 7.75-13.765625 15.691406-13.765625h19.996094c10.417969 0 18.863281-8.441406 18.863281-18.859375 0-6.53125-3.320312-12.285157-8.367187-15.671875-3.632813-2.4375-5.621094-6.6875-5.300781-11.054688zm0 0"
            fill="#e5e2e6"
          />
          <g fill="#6990d7">
            <path d="m209.214844 377.53125c0 7.480469-6.066406 9.347656-13.542969 9.347656-7.480469 0-13.542969-1.867187-13.542969-9.347656 0-7.476562 6.0625-27.085938 13.542969-27.085938 7.476563 0 13.542969 19.609376 13.542969 27.085938zm0 0" />
            <path d="m180.652344 324.886719c0 15.953125-12.933594 28.886719-28.886719 28.886719s-28.882813-12.933594-28.882813-28.886719 12.929688-28.882813 28.882813-28.882813 28.886719 12.929688 28.886719 28.882813zm0 0" />
            <path d="m268.460938 324.886719c0 15.953125-12.933594 28.886719-28.886719 28.886719s-28.886719-12.933594-28.886719-28.886719 12.933594-28.882813 28.886719-28.882813 28.886719 12.929688 28.886719 28.882813zm0 0" />
          </g>
          <path
            d="m220.144531 415.265625c-4.144531 0-7.5 3.355469-7.5 7.5v20.433594h15v-20.433594c0-4.144531-3.359375-7.5-7.5-7.5zm0 0"
            fill="#c7c0c8"
          />
          <path
            d="m203.171875 422.765625c0-4.144531-3.359375-7.5-7.5-7.5-4.144531 0-7.5 3.355469-7.5 7.5v20.433594h15zm0 0"
            fill="#c7c0c8"
          />
          <path
            d="m178.699219 443.199219v-20.433594c0-4.144531-3.359375-7.5-7.5-7.5s-7.5 3.355469-7.5 7.5v20.433594zm0 0"
            fill="#c7c0c8"
          />
        </svg>
      )
    }

    // otherwise, return what we have
    return value
  }

  function transformCellClassName(value: string | number) {
    switch (value) {
      case 'F':
        return 'cell-flag'

      case '*':
        return 'cell-bomb'

      case '_':
        return 'cell-free'

      case ' ':
        return undefined

      default:
        // Must be a 1,2,3,etc
        return `cell-number cell-${value}`
    }
  }

  return (
    <div>
      <audio autoPlay src={mainSound}>
        <track kind="captions"></track>
      </audio>
      <main>
        <h1>Mine Sweeper</h1>
        <h2>
          <button onClick={() => newGame(0)}>New Easy Game</button>
          <button onClick={() => newGame(1)}>New Intermediate Game</button>
          <button onClick={() => newGame(2)}>New Difficult Game</button>
        </h2>
        <h3>Mines: {game.mines}</h3>
        <h3>Game #: {game.id}</h3>

        <section className={`difficulty-${difficulty}`}>
          {game.board.map(function (gameRow, row) {
            return gameRow.map(function (square, col) {
              return (
                <button
                  className={transformCellClassName(square)}
                  onClick={function (event) {
                    event.preventDefault()

                    handleCheckOrFlagCell(row, col, 'check')
                  }}
                  onContextMenu={function (event) {
                    event.preventDefault()

                    handleCheckOrFlagCell(row, col, 'flag')
                  }}
                  key={col}
                >
                  {transformCellValue(square)}
                </button>
              )
            })
          })}
        </section>
      </main>
      {/* <footer>
        <img src={monk} alt="Monk" />
      </footer> */}
    </div>
  )
}
