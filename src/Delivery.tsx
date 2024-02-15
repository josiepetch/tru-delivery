import { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar"
import axios from "axios";
import { tokenSupplierId } from "./common/authUtils";
import { useLocation } from "react-router-dom";
import React from "react";

const Delivery = () => {

  const location = useLocation();
  const [editMode, setEditMode] = useState<any[]>([]);
  const [editMessage, setEditMessage] = useState(false);
  const [newPO, setNewPO] = useState<any | null>(null);
  const [newItem, setNewItem] = useState<any | null>(null);
  const [newType, setNewType] = useState<any | null>(null);
  const [newNote, setNewNote] = useState<any | null>(null);
  const [responseData, setResponseData] = useState<any[]>([]);
  const supplierId = tokenSupplierId()

  // Parse search query from URL params
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('query');

  const handleToggleEdit = (id: number) => {
    setEditMode((prevEditModes) => ({
      ...prevEditModes,
      [id]: !editMessage,
    }));
    setEditMessage(!editMessage)
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/delivery.php`, {
        action: 'mybooking',
        sid: supplierId,
        search: searchQuery,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      setResponseData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSave = async (id: number) => {
    try {
      handleToggleEdit(id)

      const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/delivery.php`, { 
        action: 'updatebooking',
        sid: supplierId,
        id,
        newPO,
        newItem,
        newType,
        newNote
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 200) {
        fetchData();
      } else {
        alert('Failed to update the booking.');
      }
    } catch (error) {
      console.error('Error occurred while updating the booking:', error);
      alert('Failed to update the booking.');
    }
  }

  const handleDelete = async (id: number, po: string, date: string) => {
    if (confirm(`Do you want to delete this delivery?\nPO Number: ${po}\nDelivery Date: ${date}`)) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/delivery.php`, { 
          action: 'deletebooking',
          sid: supplierId,
          id
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (response.status === 200) {
          alert('Success');
          fetchData();
        } else {
          alert('Failed to delete the delivery.');
        }
      } catch (error) {
        console.error('Error occurred while deleting the delivery:', error);
        alert('Failed to delete the delivery.');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <>
      <CustomNavbar />

      <div className='container'>
        <h1 className="text-center pt-3 pb-3">Delivery</h1>

        {editMessage &&
          <p className="alert alert-info text-center">Note: booking date time can't be modify</p>
        }

        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead><tr>
                <th scope="col" className="col text-center d-none d-md-block">Booktime</th>
                <th scope="col" className="col text-center">PO Number</th>
                <th scope="col" className="col text-center d-none d-md-block">Item(s)</th>
                <th scope="col" className="col text-center">Action</th>
              </tr></thead>
              {responseData && responseData.length > 0 ? (
                <tbody>
                  {responseData.map((item) => (
                    <React.Fragment key={item.id}>
                    {editMode[item.id] ? (
                      <>
                        <tr>
                          <td className="d-none d-md-block">{item.format_booktime} ({item.duration} mins)</td>
                          <td className="text-center">
                            <input type="text" name="poNumberInput"
                              value={newPO !== null ? newPO : item.po_number} onChange={(e) => setNewPO(e.target.value)} />
                          </td>
                          <td className="d-none d-md-block text-center">
                            <input type="number" name="itemInput"
                              value={newItem !== null ? newItem : item.item} onChange={(e) => setNewItem(e.target.value)} />
                            <select name='typeInput' className="d-none d-md-block" value={item.type_title} onChange={(e) => setNewType(e.target.value)}>
                              <option value="1">Palet</option>
                              <option value="2">Carlton</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <button className='btn-clear' onClick={() => handleSave(item.id)} title="Save"><i className="bi bi-floppy"></i></button>
                            <button className='btn-clear' onClick={() => handleToggleEdit(item.id)} title="Cancel"><i className="bi bi-x-lg"></i></button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <span className="d-block d-sm-none">Booktime: {item.format_booktime}</span>
                            <span className="d-block d-sm-none">Duration: {item.duration} mins</span>
                            <span className="d-block d-sm-none">
                              Item(s): <input type="number" name="itemInput"
                                value={newItem !== null ? newItem : item.item} onChange={(e) => setNewItem(e.target.value)} />
                              <select name='typeInput' value={item.type_title} onChange={(e) => setNewType(e.target.value)}>
                                <option value="1">Palet</option>
                                <option value="2">Carlton</option>
                              </select>
                            </span>
                            {item.note && (
                              <span>
                                Note: <textarea name="noteInput" className="fullwidth"
                                  value={newNote !== null ? newNote : item.note} onChange={(e) => setNewNote(e.target.value)}></textarea>
                              </span>
                            )}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td className="d-none d-md-block">{item.format_booktime} ({item.duration} mins)</td>
                          <td className="text-center">{item.po_number}</td>
                          <td className="d-none d-md-block text-center">{item.item} {item.type_title}</td>
                          <td className="text-center">
                            <button className='btn-clear' onClick={() => handleToggleEdit(item.id)} title="Edit"><i className="bi bi-pencil"></i></button>
                            <button className='btn-clear' onClick={() => handleDelete(item.id, item.po_number, item.format_booktime)} title="Delete"><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4}>
                            <span className="d-block d-sm-none">Booktime: {item.format_booktime}</span>
                            <span className="d-block d-sm-none">Duration: {item.duration} mins</span>
                            <span className="d-block d-sm-none">Item(s): {item.item} {item.type_title}</span>
                            {item.note && (
                              <span>Note: {item.note}</span>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              ) : (
                <tbody><tr><td colSpan={4}>Loading...</td></tr></tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Delivery