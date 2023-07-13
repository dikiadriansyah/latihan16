const express = require('express');
const expressLayout = require('express-ejs-layouts');
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();
const port = 3000;
 
// setup method ovveride
app.use(methodOverride('_method'));


const Contact = require('./model/contact');

// setup EJS
app.set('view engine', 'ejs');
app.use(expressLayout);// Third-party middleware
app.use(express.static('public'))// built-in middleware
app.use(express.urlencoded({extended: true})); // built-in middleware

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());

// halaman Home
app.get('/',(req, res)=>{
    // Metode app.get () digunakan untuk mendapatkan data dari sumber daya tertentu
      
    const mahasiswa = [
        {
            nama: 'Dhiki Adriansyah',
            umur: '24',
            email: 'diki@gmail.com'
        },
        {
            nama: 'Ali Saputra',
            umur: '28',
            email: 'ali@gmail.com'
        },
        {
            nama: 'Eki Fahrudin',
            umur: '34',
            email: 'eki@gmail.com'
        }
    ];

    
    res.render('index', {
        nama: 'Dhiki Adriansyah', 
        title: 'Halaman Home',
        mahasiswa: mahasiswa,
        layout: 'layouts/main-layout',
 
    });

});


// halaman about
app.get('/about',(req, res, next)=>{

    // res.send('ini adalah Halaman About');
    res.render('about',{
        layout: 'layouts/main-layout',
        title: 'Halaman About'
    });

});


// halaman contact
app.get('/contact', async(req, res)=>{
    // res.send('ini adalah Halaman Contact');
// Contact.find().then((contact)=>{
//     res.send(contact);
// });

    const contacts = await Contact.find();
    // res.send(contacts);
    
    res.render('contact',{
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contacts: contacts,
        msg: req.flash('msg')
    });
});


// halaman form tambah data kontak
app.get('/contact/add',(req,res)=>{
    res.render('add-contact',{
        title: 'Form tambah data kontak',
        layout: 'layouts/main-layout'
    });
    });


    
// proses tambah data kontak
app.post('/contact', 
[
    body('nama').custom( async(value)=>{
        
        const duplikat = await Contact.findOne({nama: value});

        if(duplikat){
            throw new Error('Nama Kontak Sudah Terdaftar')
        }
        return true;

    }),
    check('email','Email Tidak Valid').isEmail(),
    check('noHp','No Hp tidak valid').isMobilePhone('id-ID')
],
 (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
       
    res.render('add-contact',{
        title: 'Form Tambah data kontak',
        layout: 'layouts/main-layout',
        error: error.array(),
    });

    }else{
Contact.insertMany(req.body, (err,result)=>{
    // kirimkan flash message
    req.flash('msg', 'Data kontak berhasil ditambahkan');
    res.redirect('/contact');
})
    }
});



// proses hapus kontak
// app.get('/contact/delete/:nama', async(req,res)=>{
//     const contact = await Contact.findOne({nama: req.params.nama})

//     // jika kontak tidak ada
//     if(!contact){
//         res.status(404);
//         res.send('<h1>404</h1>');
//     }else{
//         Contact.deleteOne({_id: contact._id}).then((result)=>{
//             req.flash('msg', 'Data Kontak berhasil dihapus');
//             res.redirect('/contact');
// });
       
//     }
// });


app.delete('/contact', (req, res)=>{
    Contact.deleteOne({nama: req.body.nama}).then((result)=>{
        req.flash('msg', 'Data Kontak Berhasil Dihapus');
        res.redirect('/contact');
})
});



// form ubah data kontak
app.get('/contact/edit/:nama', async(req,res)=>{

    const contact = await Contact.findOne({nama: req.params.nama});
    
        res.render('edit-contact',{
            title: 'Form ubah data kontak',
            layout: 'layouts/main-layout',
            contact: contact
        });
        });



// proses ubah data
app.put('/contact', 
[
    body('nama').custom(async (value,{req})=>{
        const duplikat = await Contact.findOne({nama: value})

        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama Kontak Sudah Terdaftar')
        }
        return true;

    }),
    check('email','Email Tidak Valid').isEmail(),
    check('noHp','No Hp tidak valid').isMobilePhone('id-ID')
],
 (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){       
    res.render('edit-contact',{
        title: 'Form ubah data kontak',
        layout: 'layouts/main-layout',
        error: error.array(),
        contact: req.body,
    });

    }else{
        
Contact.updateOne(
    {_id: req.body._id},
    {
        $set: {
            nama: req.body.nama,
            email: req.body.email,
            noHp: req.body.noHp
        },
    }
    ).then((result)=>{
    // kirimkan flash message
    req.flash('msg', 'Data kontak berhasil diubah');
    res.redirect('/contact');
    });
    }
});


// ----------------
// halaman detail kontak
app.get('/contact/:nama', async(req, res)=>{
    // res.send('ini adalah Halaman Contact');

    const contact = await Contact.findOne({ nama: req.params.nama });
    
    res.render('detail',{
        layout: 'layouts/main-layout',
        title: 'Halaman detail contact',
        contact: contact
    });

});

 

     

app.listen(port, ()=>{
console.log(`Mongo Contact App| listening at http://localhost:${port}`);    
});


