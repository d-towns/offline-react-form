import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FieldValues, useForm } from 'react-hook-form'

import './App.css'
import { openDB } from 'idb'


/**
 * React useEffect takes in a lambda function and an array of dependencies
 * inside that lambda function you should define another function that does what you need. make that interior function async if you are fetching data
 * when working with the fetch api, JSON.stringify your POST request body
 * when using fetch for a GET request, make the function that wraps it async.
 * you get the response boyd of the GET request by const response = await fetch(); const data = await response.json()
 */

const API_URL = 'http://localhost:3000';

interface Person {
  firstName: string,
  lastName: string,
  age: number


}

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const { register, handleSubmit } = useForm();

  const registerWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', {scope: '/', type: 'module'})
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(registrationError => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }
  }

  async function storeFormDataLocally(formData : FieldValues) {

    const db = await openDB('formDataStore', 1);
    const tx = db.transaction('formData', 'readwrite');
    const store = tx.objectStore('formData');
    store.put(formData);
    console.log('deez')
    await tx.done;
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration : any  = await navigator.serviceWorker.ready
      try {
        await registration.sync.register('sendFormData');
          console.log('Sync event registered');
      } catch(e) {
          console.log('Failed to register sync, will retry on next visit' + e);
      }
  }
    db.close();
  }

  const onSubmit = async (data: FieldValues) => {
    if (navigator.onLine) {
      const response = await fetch(API_URL + '/people',
        { method: "POST", body: JSON.stringify(data) }
      )
      if (response.ok) {
        console.log(response)
        setPeople((prevPeople) => [{...data} as Person, ...prevPeople])
      }

    } else {
      await storeFormDataLocally(data);
    }
  }

  const getPeople = async () => {
    try {
      const response = await fetch(API_URL + '/people')
      const data: Person[] = await response.json();
      setPeople(data)
    } catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    const fetchPeople = async () => await getPeople();
    fetchPeople();
    registerWorker();
  }, []);

  return (
    <>
      <h3>Vite + React Offline Form</h3>
      <h3>App Is <span className={`${navigator.onLine ? 'online' : 'offline '}-status`}>{navigator.onLine ? 'Online' : 'Offline '}</span></h3>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='firstName'> First Name </label>
            <input {...register('firstName')} name="firstName" />
          </div>
          <div>
            <label htmlFor='lastName'> Last Name </label>
            <input {...register('lastName')} />
          </div>
          <div>
            <label htmlFor='age'> Age </label>
            <input {...register('age')} type='number' />
          </div>
          <button type='submit'> Add Person </button>
        </form>

        <div>
        <h3>People Table</h3>
          <table>
            
            <thead>
              <tr>
                <td>First Name</td>
                <td>Last Name</td>
                <td>Age</td>
              </tr>
            </thead>
            <tbody>
              {people?.map(person => <tr key={person.firstName + Math.random()}>
                <td>{person.firstName}</td>
                <td>{person.lastName}</td>
                <td>{person.age}</td>
              </tr>)}
            </tbody>
          </table>

        </div>
      </div>
    </>
  )
}

export default App
