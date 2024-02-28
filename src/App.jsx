import React, { useEffect, useState } from 'react';
import { FaPaw } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import Loader from './components/Loader';

const App = () => {

	const BASE_URL = "http://13.200.151.6";

	const [result,setResult] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [url,setUrl] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [error,setError] = useState(false);
	const [wait,setWait] = useState(false);

	const [inputType,setInputType] = useState('upload')
	const changeInputTypeToUpload = ()=>{
		setInputType('upload');
	}
	const changeInputTypeToURL = ()=>{
		setInputType('url');
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
			  setImageUrl(reader.result);
			  setResult('');
			};
			reader.readAsDataURL(file);
		}
	};	

	const temp = async ()=>{
		try {
			const response = await fetch(`${BASE_URL}`);
			const data = await response.json();
			setResult(data);
		} catch (error) {
			alert('unable to connect to api');
		}

	}

	const uploadImageFromWeb = ()=>{
		if(!url){
			alert('No URL entered')
			return;
		}

		setImageUrl(url);
		setResult('');
	}

	const predictURL = async ()=>{
		if(url==''){
			alert("No url entered")
			return;
		}
		// if(error){
		// 	alert("broken url")
		// 	return;
		// }
		setWait(true);
		try {
			const response = await fetch(`${BASE_URL}/dog-breed-identifier/url`,{
				method:"POST",
				headers: {
					'Content-Type': 'application/json' // Specify content type as JSON
				},			
				body:JSON.stringify({"url":url})
			})
			const data = await response.json();
			setResult(data);
			setWait(false);
		} catch (err) {
			setWait(false);
			alert("Unable to get response from API")
		}
	}

	const predictUpload = async ()=>{
		if (!selectedFile) {
			alert('Please select an image first.');
			return;
		}

		setWait(true);

		const formData = new FormData();
    	formData.append('image', selectedFile);

		try {
			const response = await fetch(`${BASE_URL}/dog-breed-identifier/upload`,{
				method:"POST",
				body:formData
			})
			const data = await response.json()
			if(response.ok){
				setResult(data);
			}else{
				alert("failed to upload image")
			}
			setWait(false);
		} catch (error) {
			setWait(false);
			console.error('Error uploading image:', error);
      		alert('Error uploading image. Please try again later.');
		}

	}

	return (
		<div className='min-h-screen min-w-full bg-neutral-800 text-white'>

			<div className='flex flex-col lg:flex-row gap-6 lg:justify-evenly items-center p-10 lg:p-40 w-full min-h-screen'>

				<div className='flex flex-col'>
					{/* heading */}
					<div className='mb-10 flex gap-4 items-center justify-center'>
						<FaDog size={80}/>
						<div>
							<h1 className='text-4xl  text-center'>Dog Breed <br/> Identifier </h1>
							<h1>Made with &hearts; by Harsh Priye</h1>
						</div>
						
					</div>
					{/* input type selector */}
					<div className='flex items-center justify-center gap-4 mb-5'>

						<div id='upload' className={`bg-neutral-700 flex flex-col items-center justify-center w-40 h-24 px-3 py-2 rounded-xl cursor-pointer ${inputType==='upload' ? "border-2 border-white" : ""}`} onClick={changeInputTypeToUpload}>
							<h1 className='text-xl font-extrabold w-full'><FaPaw className='inline mr-2'/>Upload</h1>
							<h2 className='text-sm w-full'>from your device</h2>
						</div>

						<div id='url' className={`bg-neutral-700 flex flex-col items-center justify-center w-40 h-24 px-3 py-2 rounded-xl cursor-pointer ${inputType==='url' ? "border-2 border-white" : ""}`} onClick={changeInputTypeToURL}>
							<h1 className='text-xl font-extrabold w-full'><FaPaw className='inline mr-2'/>Url</h1>
							<h2 className='text-sm w-full'>of any dog image from internet</h2>
						</div>

					</div>


					{/* image uploader */}
					<div className={`flex flex-col gap-4 mt-10 items-center ${inputType!=='upload' ? "hidden" : ""}`}>
						<div>Upload a Local File</div>
						<div className='flex items-center gap-2'>
							<input type="file" accept="image/*" onChange={handleFileChange} className='border p-4 rounded-xl'/>
							<button onClick={predictUpload} className='bg-neutral-700 py-1 px-2 rounded-lg'>Predict</button>
						</div>
					</div>

					{/* url field */}
					<div className={`flex flex-col gap-4 mt-10 items-center ${inputType!=='url' ? "hidden" : ""}`}>
						<div>Or use an online image</div>
						<div className='flex flex-wrap items-center justify-center gap-2'>
							<input className='rounded-lg px-2 py-1 border-2 border-white bg-neutral-800 focus:outline-none focus:border-2 focus:border-cyan-500 text-white w-1/2' type="text" name="url" id="url" value={url} onChange={(e)=>setUrl(String(e.target.value))} placeholder='Enter image URL'/>
							<button onClick={uploadImageFromWeb} className='bg-neutral-700 py-1 px-2 rounded-lg'>Upload</button>
							<button onClick={predictURL} className='block bg-neutral-700 py-1 px-2 rounded-lg'>Predict</button>
						</div>
					</div>
				</div>


				<div className={`px-0 flex flex-col lg:flex-col-reverse gap-2 items-center w-full md:w-3/4 lg:w-1/3 ${!imageUrl ? "hidden" : ""}`}>
					<div className={`${!wait ? "hidden" : ""}`}>
						<Loader/>
					</div>
					{/* result */}
					<h1 className={`${!result ? "hidden" : ""} text-center`}>Breed: {result.prediction} <br/> Probability: {(result.probability*100).toFixed(2)}%</h1>
					{/* display image */}
					<img className={`rounded-xl`} src={imageUrl} alt="Unable to load image (corrupted data/bad url)"/>
				</div>
			</div>
		</div>
	)
}

export default App;