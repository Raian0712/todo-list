import homeStyles from '../../../styles/Home.module.css'
import tableStyles from '../../../styles/Table.module.css'
import Head from 'next/head'  
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Card } from 'antd'
import { useToasts } from 'react-toast-notifications'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { gql, useMutation } from '@apollo/client'
import { client } from '../../_app'
import { print } from 'graphql'

import InputBox from "../../../components/InputBox"
import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

export async function getStaticPaths() {
  //get all todo list items
  const { data } = await client.query({
    query: gql`
    {
      todos {
        id,
        text,
        completed,
        createdAt
      }
    }`
  })

  //get all todo list items id from data
  const paths = data.todos.map((todo: {id: number, text: string, completed: boolean, createdAt: string}) => ({ params: { id: todo.id.toString() } }))

  return {
    paths: paths,
    fallback: false
  }
}

interface IParams extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  //get a single todo item with given id
  const { id } = context.params as IParams
  const GET_ONE_QUERY = `{
    todo(id: ${id}) {
      id,
      text,
      completed,
      createdAt
    }
  }`
  const { data } = await client.query({
    query: gql`${GET_ONE_QUERY}`
  })

  return {
    props: {
      todoData: data.todo
    }
  }
}

type Props = {
  todoData: {
    id: number,
    text: string,
    completed: boolean,
    createdAt: string
  }
}

const Info: React.FC<Props> = ({ todoData }) => {
  const { addToast } = useToasts()
  //store new todo list info here
  const [text, setText] = useState('')
  const [inputText, setInputText] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [completed, setCompleted] = useState(false)
  const [editing, setEditing] = useState(false)
  const router = useRouter()
  let id: number = Number(router.asPath.split('/')[2]);
  const UPDATE_QUERY = gql`
  mutation ($text: String!,$completed: Boolean!, $id: Float!) {
    updateTodo(todo: {
      text: $text,
      completed: $completed,
    }, id:$id) {
      id,
      text,
      completed,
      createdAt
    }
  }`

  const DELETE_QUERY = gql`
  mutation ($id: Float!) {
    deleteTodo(id: $id) {
      id,
      text,
      completed,
      createdAt
    }
  }
  `

  const [updateToDoItem, { data, loading, error }] = useMutation(UPDATE_QUERY)
  const [deleteToDoItem, { data: dataA, loading: loadingA, error: errorA }] = useMutation(DELETE_QUERY)

  // //load todos from localStorage and saves it into an array of json
  useEffect(() => {
    setText(todoData.text)
    setInputText(todoData.text)
    setCreatedAt(todoData.createdAt)
    setCompleted(todoData.completed)
  }, [router.asPath, todoData.completed, todoData.createdAt, todoData.text])

  async function updateToDo(id: number, text: string, completed: boolean) {
    // get a todo item from the allToDos array with matching ID
    
      // update the text and completed properties of the todo item
      //todo.text = text
      console.log(print(UPDATE_QUERY))
      updateToDoItem({ variables: { text: text, completed: completed, id: id } })
        .then(res => {
          if (completed === true) {
            //marked as Done
            addToast('Successfully marked the item as completed.', {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 2000,
            })
          } else {
            addToast('Successfully updated the todo list item', {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 2000,
            })
          }

        }).catch(err => {
          console.log(JSON.stringify(err, null, 2))
          addToast('Something went wrong. Please try again.', {
            appearance: 'error',
            autoDismiss: true,
            autoDismissTimeout: 2000,
          })
        })
    
      //save the updated todo item to te allToDos array and then into the database
      //allToDos.splice(allToDos.indexOf(todo), 1, todo)
      //localStorage.setItem('todos', JSON.stringify(allToDos))
    
  }
  
  function deleteToDo(id: number) {
    //delete the todo item from the allToDos array with matching id
    //allToDos.splice(allToDos.indexOf(allToDos.find(todo => todo.id === id)), 1)
    //localStorage.setItem('todos', JSON.stringify(allToDos))
    deleteToDoItem({ variables: { id: id } })
      .then(res => {
        addToast('Successfully deleted the todo list item', {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 2000,
        })
      }).catch(err => {
        console.log(JSON.stringify(err, null, 2))
        addToast('Something went wrong. Please try again.', {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 2000,
        })
      })
  }

  return (
    <>
      <Head>
        <title>To-Do Web App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={homeStyles.container}>
        <main className={homeStyles.main}>
          <Button type="primary" className={editing ? homeStyles.backButtonEdit : homeStyles.backButton} onClick={() => { router.back() }}>Back</Button>
          {!editing && 
            <Card title={"To-Do Item     " + ((todoData.completed) ? '✓' : '')}
              actions={[
                <FontAwesomeIcon icon={faCheck} key="markAsDone" onClick={async () => { await updateToDo(Number(id), text, true); router.push('/todos') }}/>,
                <FontAwesomeIcon icon={faEdit} key="edit" onClick={() => setEditing(true) }/>,
                <FontAwesomeIcon icon={faTrashAlt} key="delete" onClick={() => { deleteToDo(Number(id)); router.push('/todos')} }/>,
              ]}>
              <p>{ todoData.createdAt }</p>
              <p>{ todoData.text }</p>
            </Card>
          }
        
          {editing && <>
            <h3>Update to-do item here</h3>
            <div className={tableStyles.content}>
              <InputBox value={inputText} onChange={(e: React.FormEvent<EventTarget>) => { let target = e.target as HTMLInputElement; setInputText(target.value) } }/>
            </div>
            <div className={homeStyles.buttons}>
              <Button type="primary" onClick={async () => { await updateToDo(Number(id), inputText, todoData.completed); setEditing(false)} }>Edit</Button>
            </div>
          </>} 
        </main>
      </div>
    </>
  );
}

export default Info;