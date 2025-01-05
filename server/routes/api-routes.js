const path = require('path');
const controller = require('../controller/controller');
const multer = require('multer');

require('dotenv').config();

module.exports = function (app) {

  // // PAGES
  // const HOSTEL = path.join(__dirname, "../../client/public", "index.html");

  // // public routes
  // const ROUTE_FOR_HOSTEL_PAGE = '/Hostel/:id';

  // API
  const API_TO_UPDATE_ROOM = '/api/updateRoom/:Hostel';
  const API_TO_SWAP_ROOMS = '/api/swapRooms/:Hostel';
  const API_TO_POST_LOGIN_CREDENTIALS = '/login-details'

  app.post(API_TO_POST_LOGIN_CREDENTIALS, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }
    try {
      const isAuthenticated = await controller.authenticateLogin(req, username, password);
      if (isAuthenticated) {
        if (username === "admin" && password === "admin") {
          req.session.role='admin';
          res.json({ success: true, role: 'admin', message: 'Login successful' });
        }
        else {
          req.session.role='user'
          res.json({ success: true, role: 'student', message: 'Login successful' });
        }
      } else {
        res.json({ success: false, message: 'Invalid username or password' });
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  app.get('/api/check-session', (req, res) => {
    if (req.session.user) {
      res.json({ isAuthenticated: true, user: req.session.user, role: req.session.role });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  app.get('/api/check-allocation/:Hostel', async(req,res)=>{
    // console.log("check allocation");
    const {Hostel}=req.params;
    
    console.log(Hostel)
    const success = await controller.checkAllocation(Hostel,req.session.user);

    if (success) {
      res.json({isAlloted:true });
    } else {
      res.json({isAlloted:false});
    }
    
  })
  app.get('/api/logout', (req, res) => {
    if (req.session.user) {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to destroy session' });
        }
        res.clearCookie('user_sid');
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
      });
    } else {
      res.status(200).json({ success: false, message: 'No user session found' });
    }
  });
  

  app.get('/api/students/:Hostel',(req,res)=>{
    const {Hostel}=req.params;
    controller.getHostelList(req,res,Hostel);
  })

  app.put(API_TO_UPDATE_ROOM, async (req, res) => {
    const { newAdmissionNumber, roomNumber } = req.body;
    if (!newAdmissionNumber || !roomNumber) {
      return res.status(400).json({ error: 'New admission number and room number are required' });
    }
    const {Hostel}=req.params;
    const exists = await controller.checkAdmissionExists(Hostel, newAdmissionNumber);

    if (!exists) {
      return res.status(404).json({ error: 'Admission number not found' });
    }
    try {
      await controller.updateRoomInDatabase(Hostel, newAdmissionNumber, roomNumber);
      res.status(200).send('Admission number updated successfully');
    } catch (error) {
      console.error('Failed to update admission number:', error);
      res.status(500).send('Failed to update admission number');
    }
  });
  
  


  app.post(API_TO_SWAP_ROOMS, async (req, res) => {
    const { admissionNumber1, admissionNumber2 } = req.body;
    if (!admissionNumber1 || !admissionNumber2) {
      return res.status(400).json({ error: 'Both admission numbers are required' });
    }
    const {Hostel}=req.params;
    const exist1 = await controller.checkAdmissionExists(Hostel, admissionNumber1);
    const exist2 = await controller.checkAdmissionExists(Hostel, admissionNumber2);
    if (!exist1 || !exist2) {
      return res.status(404).json({ error: 'Admission number not found' });
    }
    const success = await controller.swapRoomsInDatabase('JASPER',admissionNumber1, admissionNumber2);

    if (success) {
      res.status(200).send('Rooms swapped successfully');
    } else {
      res.status(500).send('Failed to swap rooms');
    }
  });

  app.get('/api/seats/:Hostel', async (req, res) => {
    const {Hostel}=req.params;
    const { block, floor } = req.query;
    if (!block || floor === undefined) {
      return res.status(400).json({ error: 'Block and floor are required' });
    }
    try {
      const results = await controller.fetchSeats(Hostel,block, floor);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/api/seats/:Hostel', async (req, res) => {
    const {Hostel}=req.params;
    const { id, status ,user } = req.body;
    try {
      const result = await controller.updateSeatStatus(Hostel,id, status,user);
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/api/blocks/:Hostel', async (req, res) => {
    try {
      const {Hostel}=req.params;
      const results = await controller.fetchBlocks(Hostel);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get('/api/floors/:Hostel', async (req, res) => {
    try {
      const {Hostel}=req.params;
      const results = await controller.fetchFloors(Hostel);
      res.json(results);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  const upload = multer({ dest: 'uploads/' });
  app.post('/upload/:Hostel', upload.single('file'), async (req, res) => {
    const {Hostel}=req.params;
    await controller.updateHostelStudents(Hostel,req,res);
  });


app.get('/api/download/:Hostel', async (req, res) => {
  const {Hostel}=req.params;
  await controller.downloadAllotedList(Hostel,req,res);
});


}
