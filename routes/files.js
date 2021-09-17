const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const {v4: uuid4} = require("uuid");

 
// Storage setup using the multer  //

let storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'Uploads/'),
    filename: (req, file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;  //back ticks are used here " `"
        cb(null, uniqueName);

    }

});

// Upload setting using multer   //


let upload = multer({
     // if the key and value have the same name the we can pass it as a single name as done here.
     storage,
     limit:{fileSize:1000000 * 100 },  // file size is in bytes.

}).single('file');  // file name as recieved from the user.


router.post("/", (req, res) => {
    // Store file
      upload(req, res, async (err) => {
        // Validate request
        if(!req.file) 
        {
            return res.json({error : 'All fields are required.'});
        }
          if (err)
          {
             return res.status(500).send({error: err.message});
          }

            // Store into DataBase
          const file = new File({
              filename: req.file.filename,
              uuid: uuid4(),
              path: req.file.path,
              size: req.file.size,
          });
          
          const response = await file.save();
          //Response - generate a Link   //

      return res.json({ file:`${process.env.App_Base_URL}/files/${response.uuid}`});
       
      // The downlaod link is going to look like one given below // 
      // http;//localhost:3000/files/--uuid-goes-here // 

      });  


});

router.post('/send', async(req,res) => {
 
     const {uuid, emailTo, emailFrom} = req.body;
           //validate request
     if(!uuid || !emailTo || !emailFrom){
       return res.status(422).send({
              error: "All the fields are required."
       });
     }
    // Get data from database
    const file = await File.findOne({ uuid: uuid});
    if(file.sender){
      return res.status(422).send({ error: 'Email already sent.'});

    }

    file.sender = emailFrom;
    file.reciever = emailTo;
    const response =  await file.save();
    
    //send email

    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject:'Bro-share file sharing.',
      text:`${emailFrom} Shared a file with you.`,
      html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.App_Base_URL}/files/${file.uuid}`,
        size: parseInt(file.size/1000) + 'KB',
        expires: '24 Hours'
      })

    });
   
    return res.send({sucess: true});



});



module.exports = router;