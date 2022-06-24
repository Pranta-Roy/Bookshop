const express = require('express');
const app = express();
const hbs = require('hbs');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const path = require('path');
const session = require('express-session');
const async = require('hbs/lib/async');
const publicDir = path.join(__dirname);


 var dir = path.join(__dirname)+'views/partial';   
 hbs.registerPartials(dir);



 app.use(express.static(publicDir+'/views/public'));  
 app.set('view engine','hbs');
 app.use(fileUpload());
 app.use(express.urlencoded({extended:false}));
 app.use(session({secret:'abcxyz'}));   
 app.use('/public',express.static('public'));



 const db = mysql.createConnection({
     host : 'localhost',
     user : 'root',
     password : '',
     database : 'bookshop'
 });




 app.get('/home',(req,res)=>{
    res.render('home');
})

app.get('/editpage',(req,res)=>{
    res.render('editpage');
})


app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register');    
})

app.get('/adminregister',(req,res)=>{
    res.render('adminregister');    
})

app.get('/login',(req,res)=>{  
    
    res.render('login'); 
});

app.get('/adminlogin',(req,res)=>{  
    
    res.render('adminlogin'); 
});


app.get('/dashboard',(req,res)=>{  
    
    res.render('dashboard'); 
});

app.get('/profile',(req,res)=>{  
    
    res.render('edituser'); 
});

app.get('/post',(req,res)=>{  
    
    res.render('post'); 
});

app.get('/edituser',(req,res)=>{ 
    db.query('SELECT *FROM users WHERE id= ?',req.session.uname,(err,result)=>{
        res.render('editprofile',{ 
            'uname': result[0].uname,
            'pass' : result[0].password,
            'picture' : result[0].picture   
        });
    })
     
}) 


app.post('/editform',(req,res)=>{
    const{uname,pass,picture}=req.body;
    var id= req.session.uname;
    db.query('UPDATE users SET uname =?,password=?,photo=? WHERE id=?',[uname,pass,picture,id],(err,result)=>{
        console.log(err);    
    });
    
})



app.post('/submitform',(req,res)=>{
    const {uname,pass,email,address}= req.body;
    const d = Date.now();
    const photo = req.files.picture;
    const photoname = d+photo.name;
 
    db.query('SELECT *FROM users WHERE email = ?',[email,0],(err,result)=>{
         if((result.length == 0)&&(err == null)) {
         db.query('INSERT INTO users SET ?',[{uname:uname, email:email, password:pass ,photo:photoname,address:address}],(err,result)=>{
             photo.mv(publicDir+'/views/public/'+photoname,(err)=>{
                 res.redirect("/")  
                })
               })
 
             } else {  
                 res.render('register',{
                     'message':'This email already exist'
                 });
             }      
         })         
     })





     app.post('/adminsubmitform',(req,res)=>{
        const {uname,email,pass}= req.body;
        
        db.query('SELECT *FROM admin WHERE email = ?',[email,0],(err,result)=>{
             if((result.length == 0)&&(err == null)) {
             db.query('INSERT INTO admin SET ?',[{uname:uname, email:email, password:pass}],(err,result)=>{
                res.redirect("/dashboard")
                   })
     
                 } else {  
                     res.render('register',{
                         'message':'This email already exist'
                     });
                 }      
             })         
         })
    




     app.post('/submitlogin',(req,res)=>{
        const{email,pass}=req.body;
        db.query('SELECT *FROM users WHERE email =?',email,(err,result)=>{
            if(result.length==0){
                res.render('login',{
                    'message':'email doesnot exist'
                })
            } else{
                if(result[0].password == pass){
                    req.session.uname=result[0].id; 
                 res.redirect('home');
                 
                }else{
                    res.render('login',{
                        'message':'sorry pasword doesnot match'  
                    })
                }
            }
        })
    })




    app.post('/adminsubmitlogin',(req,res)=>{
        const{email,pass}=req.body;
        db.query('SELECT *FROM admin WHERE email =?',email,(err,result)=>{
            if(result.length==0){
                res.render('login',{
                    'message':'email doesnot exist'
                })
            } else{
                if(result[0].password == pass){
                    req.session.uname=result[0].id; 
                 res.redirect('dashboard');
                 
                }else{
                    res.render('login',{
                        'message':'sorry pasword doesnot match'  
                    })
                }
            }
        })
    })




    app.get('/profile/:id',(req,res)=>{
        var uid=req.params.id;
        db.query('SELECT *FROM users WHERE id =?',uid,(err,result)=>{
            res.render('profile',{
                'users':result
            });
            })
    })
    
    


    
    
    
    app.post('/submitpost',(req,res)=>{     

        const {uname,udetails,uphoto}= req.body;
        
        
    
        
           
            
        
            db.query('SELECT *FROM users WHERE id =?',(err,result)=>{
            
            db.query('INSERT INTO status SET ?',{uname:uname,details:udetails,photo:uphoto},(err,result)=>{
                if(!err){
                    res.redirect('home');
                    
                }else{
                    console.log(err);
                }
            })
        })
        })








app.listen('5000',(req,res)=>{
    console.log('Server is nicely running on port 5000');  
})