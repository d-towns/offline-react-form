import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { Database } from 'bun:sqlite'

/**
 * 1. enable cors
 * ?. create the sqlite db and the people table
 * 2. Add post endpoint that takes in the form and posts it to the sqlite db
 * 3. add a get endpoint to give me all the people in the DB
 */

const db = new Database('forms.sqlite')
db.run("CREATE TABLE IF NOT EXISTS people (firstName TEXT, lastName TEXT, age INTEGER);")

interface PeopleFormData {
  firstName: string,
  lastName: string,
  age:number
}

const formatObjKeys = <T extends Record<string, any>>(obj:T): Record<string,any> => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[`$${key}`] = obj[key];
    return acc
}, {} as Record<string, any>);
}


const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get('/people', () => {
    const query = db.query('SELECT * FROM people')
    return query.all();
  })
  .post('/people', async ({request}) => {
    const formData : PeopleFormData = await request.json()
    formData.age = Number(formData.age)

    const insert = db.prepare('INSERT INTO people (firstName, lastName, age) VALUES ($firstName, $lastName, $age)');

    const insertPeople = db.transaction((people) => {
      for(const person of people) {
        console.log(person)
        insert.run(person);
      }
    });

    const count = insertPeople([
      formatObjKeys(formData)
    ])
    console.log(`inserted ${count} people into the db!`)
    return count

  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
