"use client";
import React, { useState } from 'react'

const addBlog = () => {
    const [content, setContent] = useState();
    const [blogTitle, setBlogTitle] = useState({
        title:'',
        description:'',
        category:'',
        cover_img: ''
    })
    const [currImage, setCurrImage] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const toggleClass = (id) => {
      var element = document.getElementById(id);

      if (element.classList.contains("hidden")) {
        // Remove the class if it exists
        element.classList.remove("hidden");
      } else {
        // Add the class if it doesn't exist
        element.classList.add("hidden");
      }
    }
    const handleAddHead = () => {
        const textarea = document.getElementById('input-text').value;
        const newText = <h1 className='font-extrabold text-4xl mt-5 text-center'>{textarea}</h1>;
        setContent([content,newText]);
        document.getElementById('input-text').value = "";
    }
    const handleAddSubhead = () => {
        const textarea = document.getElementById('input-text').value;
        const newText = <h1 className='font-bold text-2xl mt-3 text-center'>{textarea}</h1>;
        setContent([content,newText]);
        document.getElementById('input-text').value = "";
    }
    const handleAddPara = () => {
        const textarea = document.getElementById('input-text').value;
        const newText = <p className='font-light my-3'>{textarea}</p>;
        setContent([content,newText]);
        document.getElementById('input-text').value = "";
    }

    const handleImageChange = (e) => {
        debugger;
        const file = e.target.files[0];

        if(!file) return;

        if(!file.type.includes('image')) {
            return alert('Please upload an image file');
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result;

            setCurrImage(result);;
        }
        
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        debugger;
        setSubmitting(true);

        try {
            const form = e.currentTarget;
            const fileInput = Array.from(form.elements).find(({name}) => name === 'file')
            //console.log(fileInput);
            const formData = new FormData();

            for( const file of fileInput.files ){
                formData.append('file', file);
            }

            formData.append('upload_preset','vtxkm6s0')

            const data = await fetch('https://api.cloudinary.com/v1_1/dcsvvfai3/image/upload', {
                method: 'POST',
                body: formData
            }).then(r => r.json());

            if(blogTitle.cover_img == ''){
                blogTitle.cover_img = data.secure_url;
            }

            const newImage = <img src={data.secure_url} alt="" className='w-1/2 m-4' />;
            setContent([content,newImage]);
            setSubmitting(false)
        } catch (error) {
            
        }
    }

    const handleBlogSubmit = async() => {
        debugger;
        setSubmitting(true);
        if(content == null || blogTitle.title == "" || blogTitle.description == ""){
            alert("Fill the fields marked with *");
            return;
        }
        try {
            let inCanvas = document.getElementById('canvas').innerHTML;
            const response = await fetch('/api/blogs/new',{
                method: 'POST',
                body: JSON.stringify({
                    content: inCanvas,
                    title: blogTitle.title,
                    description: blogTitle.description,
                    category: blogTitle.category,
                    cover_img: blogTitle.cover_img
                })
            })

            if(response.ok){
                location.reload();
            }
        } catch (error) {
            console.log(error);
        } finally{
            setSubmitting(false);
        }
    }

  return (
    <section className='bg-white'>
        <h1 className='font-extrabold text-4xl'>Create a new blog</h1>
        <div className="tools flex flex-col gap-4">
            <div className="details flex flex-row gap-4">
                <div className="add-subheader bg-slate-300 px-4 py-2 rounded-md h-fit">
                    <p>&#42;Title:</p>
                    <input type="text" className='px-4 border-[1px] border-gray-500 rounded' placeholder='Title for your blog' onChange={(e) => setBlogTitle({...blogTitle,title: e.target.value})}/>
                </div>

                <div className="add-subheader bg-slate-300 px-4 py-2 rounded-md h-fit">
                    <p>&#42;Description:</p>
                    <input type="text" className='px-4 border-[1px] border-gray-500 rounded' placeholder='description for your blog' onChange={(e) => setBlogTitle({...blogTitle,description: e.target.value})}/>
                </div>

                <div className="add-subheader bg-slate-300 px-4 py-2 rounded-md h-fit">
                    <p>&#42;category:</p>
                    <input type="text" className='px-4 border-[1px] border-gray-500 rounded' placeholder='#category' onChange={(e) => setBlogTitle({...blogTitle,category: e.target.value})}/>
                </div>
            </div>
            
            <div className="flex flex-row gap-4">
                <div className="add-header bg-slate-300 rounded-md h-fit">
                    <button className='px-4 py-2' onClick={() => {toggleClass("textbox")}}>Add Text</button>
                </div>

                <div className="add-subheader bg-slate-300 rounded-md h-fit">
                    <button className='px-4 py-2' onClick={() => {toggleClass("img-input")}}>Add Image</button>
                </div>
            </div>
            
        </div>
        <div className="bg-slate-300 w-fit p-3 my-2 hidden rounded-md flex-col" id='textbox'>
            <textarea name="" id ='input-text'cols="30" rows="10" className='Header border-2 border-black h-20 w-96 pt-0 rounded-md' placeholder='text'></textarea>
            <button className='bg-slate-600 px-4 py-2 rounded-md mb-2 ml-2' onClick={() => {document.getElementById('input-text').value = ""}}>Clear</button>
            <div className="btns flex flex-row gap-4">
                <button className='bg-slate-600 px-4 py-2 rounded-md' onClick={() => {handleAddHead()}}>Add as Heading</button>
                <button className='bg-slate-600 px-4 py-2 rounded-md' onClick={() => {handleAddSubhead()}}>Add as Subheading</button>
                <button className='bg-slate-600 px-4 py-2 rounded-md' onClick={() => {handleAddPara()}}>Add as Paragraph</button>
            </div>
        </div>
        <div className="bg-slate-300 w-fit hidden p-3 m-3 rounded" id='img-input'>
            <form onSubmit={handleAddImage} className='flex gap-3'>
                <input type="file" name='file' placeholder="Upload an image" onChange={handleImageChange} className='Header border-2 border-black p-2 rounded' id='input-img'/>
                <button type='submit' className='bg-slate-900 text-white px-5 rounded-lg'>{submitting ? `Uploading..` : `Add Image`}</button>
            </form>
            
        </div>
        
        
        <div id='canvas' className="canvas flex flex-col items-center px-16">{content}</div>
        <button onClick={handleBlogSubmit} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">{submitting ? `Creating..` : `Create`}</button>
    </section>
  )
}

export default addBlog