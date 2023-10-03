import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import EditTask from "./editTask";


function CreateTasks() {
    const [date, setDate] = useState("");
    const [completed, setCompleted] = useState(false);
    const [task_name, setTaskName] = useState("");
    const [tasks, setTasks] = useState([]);
    //const [isEditing, setIsEditing] = useState(false);  
    const [editingStates, setEditingStates] = useState({});



    //const [completedTaskCount, setCompletedTaskCount] = useState(0);
    const auth = getAuth();
    const db = getFirestore();

    function handleTaskNameChange(event) {
        const newTaskName = event.target.value;
        setTaskName(newTaskName);
    }

    function handleDateChange(event) {
        const newDate = event.target.value;
        setDate(newDate);
    }


    const handleTaskCompletion = async (id) => {
        try {
            let task = tasks.find((task) => task.id === id);
            const updateTask =
                tasks.map((task) => {
                    if (task.id === id) {
                        task.completed = !task.completed;
                        setCompleted(task.completed);
                        console.log(task.completed);
                        console.log(task);
                        return task;
                    } else {
                        return task;
                    }
                });
            setTasks(updateTask);
            console.log(updateTask);
            const docRef = doc(db, "users", auth.currentUser.email, "tasks", id);
            await setDoc(docRef, {
                task_name: task.task_name,
                date: task.date,
                completed: task.completed,
            });
            console.log("Document successfully updated!");
            //await deleteFromFirebase(id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    /*const deleteFromFirebase = async (id) => {
      try {
        const docRef = doc(db, "users", auth.currentUser.email, "tasks", id);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    };
    */



    const handleAddTask = async (e) => {


        e.preventDefault();
        try {
            const user = auth.currentUser;
            const userEmail = user.email;
            console.log(userEmail);
            if (user) {
                const docRef = await addDoc(collection(db, "users", userEmail, "tasks"), {

                    task_name: task_name,
                    date: date,
                    completed: false,

                });

                console.log("Document written with ID: ", docRef.id);
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    };


    /*
    const handleEditClick = () => {
        setIsEditing(true);
    };*/


    /*  const handleEditClick = (task) => {
          setIsEditing(true);
          console.log(task);
         return (
              <EditTask
              task_ID={task.id}
              task_name={task.task_name}
              date={task.date}
              completed={task.completed}
              id={task.id}
            />
         )
      };*/





    const toggleEdit = (task_ID) => {
        setEditingStates((prev) => ({
            ...prev,
            [task_ID]: !prev[task_ID]
        }));
    };







    const EditTaskForm = (task) => {

        return (
            <div>
                <EditTask
                    task_ID={task.id}
                    task_name={task.task_name}
                    date={task.date}
                    completed={task.completed}
                    id={task.id}
                />
            </div>
        );

    }


    const deleteTask = async (id) => {
        try {
            const docRef = doc(db, "users", auth.currentUser.email, "tasks", id);
            await deleteDoc(docRef);
            console.log("Document successfully deleted!");
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    };


    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;


        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userEmail = user.email;
                const db = getFirestore();

                const fetchTasks = async () => {
                    try {
                        //setTasks("getting link")
                        const querySnapshot = await getDocs(collection(firestore, "users", userEmail, "tasks"));
                        const tasksData = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        console.log(tasksData);
                        setTasks((prevTasks) => [...prevTasks, ...tasksData]);
                        setTasks(tasksData);

                    } catch (error) {
                        console.error("Error fetching tasks:", error);
                    }
                };

                fetchTasks();
            } else {
                console.log("No user is signed in");

            }
        });
    }, []);


    return (

        <div id="tasks">


            <form className="form-control  flex flex-row gap-4" id="task-form">
                <div>
                    <label htmlFor="task_name">Task name</label>
                    <input type="text" onChange={handleTaskNameChange} value={task_name} />
                </div>

                <div>
                    <label htmlFor="task_due_date"> Due date</label>
                    <input type="date" onChange={handleDateChange} value={date} />
                </div>
                <button onClick={handleAddTask} id="add-task-button">
                    <span>Add</span>
                </button>

            </form>
            <div id="tasks-list">
                {tasks.map((task) => (
                    <div key={task.id} className="flex flex-row  " id="single-task">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskCompletion(task.id)}
                        />


                        <div>
                            <h2
                                style={{
                                    textDecoration: task.completed ? "line-through" : 'none',
                                }}

                                className="font-[DM-sans] text-xl m-2">{task.task_name}</h2>
                        </div>
                        <div>
                            <p className="p-2 font-[DM-sans]">{task.date}</p>

                        </div>


                        {/* <h2> {task.id}</h2> */}


                        <div className="flex flex-row mt-2  gap-8 ">
                            <div>
                                <button onClick={() => toggleEdit(task.id)} id="edit-task-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                    </svg>
                                </button>
                                {editingStates[task.id] && <EditTaskForm

                                    task_ID={task.id}
                                    task_name={task.task_name}
                                    date={task.date}
                                    completed={task.completed}
                                    id={task.id} />
                                }

                            </div>

                            <div>
                                <button onClick={
                                    () => deleteTask(task.id)
                                } id="delete-task-button"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                              </svg> 
                                  
                                </button>
                            </div>
                        </div>




                        {/*<button onClick={
                        () => handleEditClick(task)
                     }> 
                        <span>Edit</span>
                    </button>*/}



                        {/*<EditTask
                         task_ID = {task.id}
                         task_name={task.task_name}
                        date={task.date}
                        completed={task.completed}
                        id={task.id}
                    />*/}


                    </div>
                ))}
                </div>
            </div>


    );
}


export default CreateTasks;