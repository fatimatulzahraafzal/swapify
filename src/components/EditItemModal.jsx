import { useState , useEffect} from 'react';

function EditItemModal({item, onClose, onSubmit}) {
  const [title , setTitle] = useState('')
  const [image_url , setImageURL] = useState('')
  const [rating , setRating] = useState('')
  const [description , setDescription] = useState('')
  const [accepts, setAccepts] = useState('')

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setImageURL(item.image_url)
      setRating(item.rating)
      setDescription(item.description)
      setAccepts(item.accepts)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title , image_url , rating, description, accepts})
  }

  return(
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-xl font-bold mb-4'></h2>
        <form onSubmit = {handleSubmit}>
          <input type = "text" placeholder='Title' value= {title} onChange = {e=> setTitle(e.target.value)} required className='w-full p-2 border mb-3'>
          </input>

          <input type = "text" placeholder='Image URL' value= {image_url} onChange = {e=> setImageURL(e.target.value)} required className='w-full p-2 border mb-3'>
          </input>

          <select value ={rating} onChange = {e => setRating(e.target.value)} className='w-full p-2 border mb-3' >
            {[1,2,3,4,5].map(n=> <option key = {n} value = {n} > {n} Stars</option>)}
          </select>

          <textarea placeholder='Description' value= {description} onChange = {e=> setDescription(e.target.value)} required className='w-full p-2 border mb-3'>
          </textarea>

          <input type = "text" placeholder='Accepts' value= {accepts} onChange = {e=> setAccepts(e.target.value)} required className='w-full p-2 border mb-3'>
          </input>



        </form>

      </div>


    </div>
  )

}