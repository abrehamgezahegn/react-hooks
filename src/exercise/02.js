// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

export function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const setDefaultValue = () =>
    deserialize(localStorage.getItem(key)) || defaultValue
  const [state, setState] = React.useState(setDefaultValue)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  const prevKey = React.useRef(key)

  // to demo the diff between useRef and plain variable
  // num2 is re-initialized on every render, num is only initialized once
  // const num = React.useRef(0)
  // let num2 = 0

  React.useEffect(() => {
    if (prevKey.current !== key) {
      localStorage.removeItem(prevKey)
    }
    prevKey.current = key

    localStorage.setItem(prevKey.current, serialize(state))
    // num2 al
    // num.current = num.current + 1
    // num2 = num2 + 1
    // console.log('REF NUM ', num.current)
    // console.log('VAR NUM', num2)
  }, [state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const setInitialState = () => localStorage.getItem('name') || initialName
  // const [name, setName] = React.useState(setInitialState)

  // // 🐨 Here's where you'll use `React.useEffect`.
  // // The callback should set the `name` in localStorage.
  // // 💰 window.localStorage.setItem('name', name)

  // React.useEffect(() => {
  //   localStorage.setItem('name', name)
  // }, [name])

  const [name, setName] = useLocalStorageState('name', 'Better work')

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Booboo" />
}

export default App
