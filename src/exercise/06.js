// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (pokemonName === '') return

    const fetchData = async () => {
      setState(prev => ({...prev, status: 'pending'}))
      try {
        const res = await fetchPokemon(pokemonName)
        setState(prev => ({...prev, status: 'resolved', pokemon: res}))
      } catch (error) {
        setState(prev => ({...prev, status: 'rejected', error: error}))
      }
    }

    fetchData()
  }, [pokemonName])

  if (state.status === 'idle') return <h4>Submit a pokemon name</h4>
  if (state.status === 'pending')
    return <PokemonInfoFallback pokemon={state.pokemon} />
  if (state.status === 'resolved')
    return <PokemonDataView pokemon={state.pokemon} />
  if (state.status === 'rejected') throw state.error
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundary
        onReset={() => {
          setPokemonName('')
        }}
        resetKeys={[pokemonName]}
        FallbackComponent={ErrorFallback}
      >
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
