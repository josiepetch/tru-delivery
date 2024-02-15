import { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar"
import axios from "axios";
import { tokenSupplierId } from "./common/authUtils";
import { formatDate } from "./common/dateTime"
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from "react-router-dom";


const DeliveryInsert = () => {

    // fetch holiday
    interface Holiday {
        title: string;
        start: string;
    }
    const [holidays, setHolidays] = useState<any[]>([]);
    
    const fetchData = async () => {
        try {
            const response = await fetch('../holiday.json');
            const jsonData: Holiday[] = await response.json();

            const holidayDates = jsonData.map(holiday => holiday.start);

            setHolidays(holidayDates);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    // end  of fetch holiday

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        ponumber: '',
        datetime: '',
        item: '',
    });
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const supplierId = tokenSupplierId()
    const [ponumber, setPonumber] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<any | null>(null);
    const [item, setItem] = useState<any | null>(null);
    const [typenum, setTypenum] = useState<any | null>(null);
    const [note, setNote] = useState<any | null>(null);


    const currentDate = new Date();
    const melbourneOffset = 11 * 60; // Melbourne timezone offset in minutes
    const userOffset = currentDate.getTimezoneOffset();
    const melbourneTime = currentDate.getTime() + (userOffset * 60 * 1000) + (melbourneOffset * 60 * 1000);
    const currentDateMelbourne = new Date(melbourneTime);
    const minDate = new Date(currentDateMelbourne);
    minDate.setDate(currentDateMelbourne.getDate() + 1); // Set the minimum date to tomorrow
    // Set minimum time to 9:00 AM
    const minTime = new Date(currentDateMelbourne);
    minTime.setHours(9, 0, 0, 0);
    // Set maximum time to 4:00 PM
    const maxTime = new Date(currentDateMelbourne);
    maxTime.setHours(16, 0, 0, 0);

    const isDayOff = (date : any) => {
        
        const day = date.getDay();
        if (day === 0 || day === 6) { // It's a weekend
            return false;
        }

        // Check if the selected date is a holiday
        const formattedDate = formatDate(date);
        return !holidays.includes(formattedDate);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleLink = (text : string) => {
        navigate(`/${text}`);
    }

    const handleSubmit = () => {
        let isValid = true;
        const newErrors = {
            ponumber: '',
            datetime: '',
            item: '',
        };

        // Validate form fields
        if (!ponumber) {
            isValid = false;
            newErrors.ponumber = 'Please insert PO Number';
        }
        if (!selectedDate) {
            isValid = false;
            newErrors.datetime = 'Please select a date and time';
        }
        if (!item) {
            isValid = false;
            newErrors.item = 'Please insert item(s)';
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                setIsBtnLoading(true);
                axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/delivery.php`, {
                    action: 'insertbooking',
                    sid: supplierId,
                    ponumber,
                    selectedDate,
                    item,
                    typenum,
                    note
                }).then(function(response){
                    console.log(response);
                    if (response.data.status === 200) {
                        navigate('/delivery');
                    } else {
                        console.error('Booking failed');
                    }
                });
            } catch (error) {
                console.error('An error occurred during login:', error);
            }
        }
            
        setIsBtnLoading(false);
    };

    return (
        <>
            <CustomNavbar />

            <div className='container'>
                <h1 className="text-center pt-3 pb-3">Book A Slot</h1>
                <div className='form-small'>
                <div className="row"><div className="col-md-12">
                    <div className='input-container'>
                        <input type="text" id="ponumber" name='ponumber' onChange={(e) => setPonumber(e.target.value)} />
                        <label>PO Number *</label>
                        <p className="text-danger"><i>{errors.ponumber}</i></p>
                    </div>

                    <div className='input-container'>
                        <ReactDatePicker
                            id="datetime"
                            name='datetime'
                            selected={selectedDate}
                            onChange={handleDateSelect}
                            showTimeSelect
                            minDate={minDate}
                            minTime={minTime}
                            maxTime={maxTime}
                            filterDate={isDayOff}
                            dateFormat="d MMMM yyyy h:mm"
                        />
                        <label>Date and Time *</label>
                        <p className="text-danger"><i>{errors.datetime}</i></p>
                    </div>

                    <div className='input-container'><div className='row'>
                        <div className="col">
                            <input type="number" id="item" name="item" onChange={(e) => setItem(e.target.value)} />
                            <label>Item(s) *</label>
                            <p className="text-danger"><i>{errors.item}</i></p>
                        </div>
                        <div className="col">
                            <select id='typenum' name='typenum' onChange={(e) => setTypenum(e.target.value)}>
                                <option value="1">Palet</option>
                                <option value="2">Carlton</option>
                            </select>
                        </div>
                    </div></div>

                    <div className='input-container'>
                        <textarea id='note' name='note' onChange={(e) => setNote(e.target.value)}></textarea>
                        <label>Note</label>
                    </div>

                    <div className='input-container'><div className='row'>
                        <div className="col">
                            <button className="btn btn-fullwidth btn-blue" disabled={isBtnLoading} onClick={handleSubmit}>
                                {isBtnLoading ? 'Booking...' : 'Book Now'}
                            </button>
                        </div>
                        <div className="col">
                            <button className="btn btn-fullwidth btn-darkgray" onClick={() => handleLink('delivery')}>Cancel</button>
                        </div>
                    </div></div>
                </div></div>
            </div></div>
        </>
    )
}

export default DeliveryInsert