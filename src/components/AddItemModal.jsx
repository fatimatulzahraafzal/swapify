import {usetate} from'react'

function AddItemModal({ onClose, onSubmit}) {

  return(
    <div className='fixed inset-0 bg-black-50 flex items-center z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4'>
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl px-8 py-6'>
          <h1 className="text-3xl font-bold text-white text-center">
            Add New Item
          </h1>
        </div>

        <div className="p-8">
          {/* Form will go here */}
        </div>
      </div>

    </div>
  )
}

export default AddItemModal