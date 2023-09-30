import { getAuth } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { getFirestore, collection, addDoc, doc  } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, ref , uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from 'react-color';


function AddNote() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState('');
    const [files , setFiles] = useState([]); // [file1 , file2 , file3]
    const [colorLabel, setColorLabel] = useState('');
    const [filesArray, setFilesArray] = useState([]);
    const [fileType, setFileType] = useState('');

    const navigate = useNavigate();

    const auth = getAuth();
    const db = getFirestore();


    function handleFileChange(event) {
        // const file = event.target.files[0];
        // setFile(file);

        const files = event.target.files;
        setFiles(Array.from(files));
        console.log(files);
        const filesArray = Array.from(files);
        setFilesArray(filesArray);
        console.log(filesArray);

      
        

        // if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
        //     setFileType('image');
        // }
        // else if(file.type === 'application/pdf') {
        //     setFileType('pdf');
        // }
        // else{
        //     setFileType('other');
        // }
        


    }

    const handleAddNote = async (e ) => {
        e.preventDefault();
        if (Array.isArray(files) && files.length > 0 ){
        try {


            //const db = getFirestore();
            const user = auth.currentUser;
            const userEmail = user.email;
            //part of original const url = URL.createObjectURL(file);
            console.log(user);
            if (user) {
                
                try{
                
                // Map the array of files to an array of promises
            const promises = files.map((file) => {
                const storageRef = ref(storage, `users/${userEmail}/notes/${file.name}`);
                return uploadBytes(storageRef, file).then(async (snapshot) => {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    console.log('File uploaded successfully:', downloadURL);
                    return downloadURL;
                });
            });

            
                const fileDownloadURLs = await Promise.all(promises);
                console.log(fileDownloadURLs);
            


                //get the download urls of the files

                
                //correct line const storageRef = ref(storage, `users/${userEmail}/notes/${file.name}`);
                // const downloadURL = await getDownloadURL(storageRef);


                //correct line getDownloadURL(ref(storage, `users/${userEmail}/notes/${file.name}`)
                //);

                // correct const uploadTask = uploadBytesResumable(storageRef, file);
                // uploadTask.on('state_changed',
                //     (snapshot) => {
                //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //         console.log('Upload is ' + progress + '% done');
                //     },
                //     (error) => {
                //         console.log(error);
                //     },
                //     async () => {
                //         try {
                //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                //   correct          console.log('File available at', downloadURL);
                            const note = {
                                title,
                                content,
                                files: fileDownloadURLs,
                                colorLabel,
                                createdAt: new Date()
                            }
                            const notesCollection = collection(db, "users", userEmail, "notes");

                            await addDoc(notesCollection, note);
                            navigate('/Note-App/FetchNotes');
                            console.log("Document successfully written!");

                        } catch (error) {
                            console.log(error);
                        }
               
                    
                
                
               

            } else {
                console.log("No user is signed in");
            }
       

        } catch (error) {
            console.log(error);
        }
    }
    else{
        console.error('No files selected.');

    }

    }

    return (
        <>

            {/*<button>
                <a href="/Note-App/CreateTasks">Fetch tasks</a>
    </button>*/}

            <div className="lg:bg-black w-full border-2">
                <h1>Add a Note</h1>
                <form className="lg:bg-black ">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title" aria-describedby="emailHelp" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Content">Content</label>
                        <input type="text" className="form-control" id="desc" placeholder="Content" onChange={(e) => setContent(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">File</label>
                        <input type="file" className="form-control" id="file" placeholder="File" onChange={handleFileChange} multiple />
                    </div>

                    <div className="form-group">
                        <label htmlFor="colorLabel">Color Label</label>
                        <SketchPicker color={colorLabel} onChangeComplete={(color) => setColorLabel(color.hex)} />
                    </div>


                    <button type="submit" className="btn btn-primary" onClick={handleAddNote} > Add Note</button>
                </form>
            </div>
        </>
    )
}

export default AddNote;