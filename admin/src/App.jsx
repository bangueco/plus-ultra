import { useState } from 'react';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (data) => {
    setEditData(data);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    console.log("Deleted item with ID:", id);
  };

  return (
    <div className="App p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Exercise</h1>

      <button 
        onClick={() => setShowModal(true)} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
      >
        Add New Item
      </button>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example Static Data */}
          {[1, 2, 3].map(id => (
            <tr key={id} className="border-t">
              <td className="px-4 py-2">{id}</td>
              <td className="px-4 py-2">Item {id}</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => handleEdit({ id, name: `Item ${id}` })}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit Item */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-2xl mb-4">{editData ? 'Edit Item' : 'Add New Item'}</h2>
            <input 
              type="text" 
              placeholder="Enter item name" 
              className="border border-gray-300 p-2 w-full mb-4 rounded" 
              defaultValue={editData ? editData.name : ''}
            />
            <div className="flex justify-between">
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  // Simulate form submission
                  setShowModal(false);
                  console.log(editData ? 'Updating item' : 'Adding new item');
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {editData ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
