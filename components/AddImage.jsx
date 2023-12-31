"use client";
import React, { useState } from 'react'

const AddImage = () => {

    const [currImage, setCurrImage] = useState('');
    const [submitting, setSubmitting] = useState(false)
    const [imgInfo, setImgInfo] = useState({
        description:"",
        category: ""
    })


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
        debugger;

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


            const response = await fetch('/api/image/new',{
                method: 'POST',
                body: JSON.stringify({
                    imgUrl: data.secure_url,
                    description: imgInfo.description,
                    category: imgInfo.category
                })
            })
            
            if(response.ok){
                alert("image added");
                document.getElementById('input-img').value = ""
                document.getElementById('category').value = ""
                document.getElementById('description').value = ""
            }

            setSubmitting(false)
        } catch (error) {
            alert(error)
        }
    }

  return (
    <div className="bg-slate-300 w-[300px] sm:w-fit p-3 m-3 rounded" id='img-input'>
        <form onSubmit={handleAddImage} className='flex flex-col gap-3'>
            <div className='flex flex-col sm:flex-row gap-3'>
                <div className="flex flex-col gap-1">
                    <p>Description</p>
                    <input type="text" placeholder='Description' name="description" id="description" onChange={(e) => setImgInfo({...imgInfo,description: e.target.value})} className=' px-3 py-2 rounded'/>
                </div>
                <div className="flex flex-col gap-1">
                    <p>Category</p>
                    <input type="text" placeholder='Category' name="category" id="category" onChange={(e) => setImgInfo({...imgInfo,category: e.target.value})} className=' px-3 py-2 rounded'/>
                </div>
            </div>
            
            <div className='flex gap-3'>
                <input type="file" name='file' placeholder="Upload an image" onChange={handleImageChange} className='Header border-2 border-black p-2 rounded' id='input-img'/>
                <button type='submit' className='bg-slate-900 text-white px-5 py-3 rounded-lg cursor-pointer'>{submitting ? `Uploading..` : `Add Image`}</button>
            </div>
            
            
        </form>
    </div>
  )
}

export default AddImage