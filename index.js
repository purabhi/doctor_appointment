import express from "express"
import user from "./models/usermodel.js"
import doctor from "./models/doctormodel.js"
import appointment from "./models/appointment.js"

const app=express()


app.use(express.urlencoded({extended:true}))
app.use(express.json())


// *******************************CLIENT**************************************//


//Register User
app.post('/api/user/registerUser', async (req, res) => {
        const { name, pass} = req.body;
        try {
            if(!name || !pass)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
                }
            let User = await user.findOne({ name,pass });
            if (User) {
                return res.status(400).json({ msg: 'User already exists' });
            }
            User = new user({
                name,
                pass
            });
    
            await User.save();
    
            res.status(200).json({ msg: 'Success' });
    
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });
    
    
    //Login User
    app.post('/api/user/loginUser', async (req, res) => {
        const { name, pass } = req.body;
    
        try 
        {
            if(!name || !pass)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
                }
            let User = await user.findOne({ name,pass });
            if (!User) 
            {
                return res.status(400).json({ msg: 'Invalid credentials'});
            }
    
    
            res.status(200).json({ msg: 'Success', userid:User._id  });
    
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });


    //Fetch doctors by category
app.get('/api/user/getDoc_byCategory/:category', async (req, res) => {
        const { category } = req.params;
    
        try {
            if(!category)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
     
                }
            const doctors = await doctor.find({ speciality:category });
            
            if (doctors.length === 0) {
                return res.status(400).json({ msg: 'No doctors found in this category' });
            }
    
            res.status(200).json({msg: doctors });
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });
    
    
    //Fetch appointments by patient ID and status "booked"
    app.get('/api/user/getAppointments_byPatientId/:pat_id', async (req, res) => {
        const { pat_id } = req.params;
    
        try {
            if(!pat_id)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
     
                }
            const appointments = await appointment.find({ pat_id, status: "booked" });
    
            if (appointments.length === 0) {
                return res.status(400).json({ msg: 'No appointments yet !! ' });
            }
    
            res.status(200).json({ msg: appointments });
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });
    
    
    // Route for booking an appointment
    app.post('/api/user/bookAppointment', async (req, res) => {
        const { pname, dname, age, disease, phone, pat_id, doc_id,spec } = req.body;
    
        try {
            if(!pname|| !dname|| !age || !disease ||!phone || !pat_id ||!doc_id ||!spec)
                {
                    return res.status(400).json({msg:"Pls fill all fields"})
                }
            const newAppointment = new appointment({
                pname,
                dname,
                age,
                disease,
                phone,
                pat_id,
                doc_id,
                spec,
                status: "booked" 
            });
    
            await newAppointment.save();
    
            res.status(200).json({ msg: 'Success', appointment: newAppointment });
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });


    // *********************************DOCTOR*************************************//


// Login Doctor
app.post('/api/doctor/loginDoctor', async (req, res) => {
        const { name, pass } = req.body;
    
        try 
        {
            if(!name || !pass)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
                }
            let User = await doctor.findOne({ name,pass });
            if (!User) 
            {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
    
            res.status(200).json({ msg: 'Success' ,userid:User._id});
    
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });
    
    
//Fetch appointments by doctor ID and status "booked"
app.get('/api/doctor/getAppointments_byDoctorId/:doc_id', async (req, res) => {
        const { doc_id } = req.params;
    
        try {
            if(!doc_id)
                {
                    return res.status(400).json({ msg: 'Pls fill all fields' });
     
                }
            const appointments = await appointment.find({ doc_id, status: "booked" });
    
            if (appointments.length === 0) 
            {
                return res.status(400).json({ msg: 'No appointments yet !!' });
            }
    
            res.status(200).json({ msg: appointments });
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });
    
    
    // Route to update appointment status to "done" by ID
    app.put('/api/doctor/updateAppointmentStatus/:_id', async (req, res) => {
        const { _id } = req.params;
    
        try {
            if(!_id)
                {
                    return res.status(400).json({msg:"Pls fill all fields"})
      
                }
            const appointments = await appointment.findById(_id);
    
            if (!appointments) {
                return res.status(400).json({ msg: 'Appointment not found' });
            }
    
            appointments.status = 'done';
            await appointments.save();
    
            res.status(200).json({ msg: 'Success', upadatedappointment:appointments });
        } 
        catch (err) 
        {
            res.status(500).json({ msg: 'Server Error' });
        }
    });



const port=5600
app.listen(port,()=>console.log(`server is running in port:`,port))