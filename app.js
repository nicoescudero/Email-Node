const express=require('express');
const app=express();
const nodemailer=require('nodemailer');
const path=require("path");
require('dotenv').config();

app.set('port',process.env.PORT || 3000);
app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,'views'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/public',express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/rta',(req,res)=>{
    res.render('rta');
})

app.post('/send',async(req,res)=>{
    const {name,email,R_email,subject,text}=req.body;
    const content=`
    <h2>From: ${name}</h2>
    <ul>
        <li>Email: ${email}</li>
        <li>Subject: ${subject}</li>
    </ul>
    <h4>${text}</h4>
    `;

    let transport=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure: true,//with tls
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    let info=await transport.sendMail({
        from:`"${subject}" <${email}>`,
        to: R_email,
        html:content
    })
    console.log('Message sent: ',info.messageId);
    res.redirect('rta');
})


app.listen(app.get('port'),()=>console.log(`server listen on port ${app.get('port')}`));