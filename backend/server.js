const express = require('express')
const bodyParser = require('body-parser')
const mysql = require("mysql");
const path =require('path') ;
const server = express();
server.use(bodyParser.json());

var cors = require('cors');
server.use(cors());


const multer = require('multer')

server.use(express.static('public'));

//const upload = multer({ dest: 'images/' })
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/images')
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


//Establish the database connection

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "db_food_ordering",

});

db.connect(function (error) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      console.log("successfully Connected to DB");
    }
  });

//Establish the Port

  server.listen(8085,function check(error) {
    if (error) 
    {
    console.log("Error....!!!!");
    }

    else 
    {
        console.log("Started....!!!! 8085");

    }
});


server.post('/upload', upload.single('image'), (req, res) => {
  const image=req.file.filename

  const sql ="UPDATE food SET image=? ORDER BY f_id DESC LIMIT 1";
  db.query(sql,[image],(err,result)=>{
    if(err) return res.json({Message:"Error"});
    return res.json({Status:"Success"});
  })

  console.log(req.file)
 // res.send({description, imageName})
})

server.post('/upload2', upload.single('image'), (req, res) => {
  const image=req.file.filename
  const f_id=req.body.f_id
  //console.log("x="+f_id);
  const sql ="UPDATE food SET image=? WHERE f_id=?";
  db.query(sql,[image,f_id],(err,result)=>{
  //  if(err) return res.json({Message:"Error"});
   // return res.json({Status:"Success"});
  })

  // Save this data to a database probably

  console.log(req.file)
 // res.send({description, imageName})
})

server.post('/uploadRes', upload.single('image'), (req, res) => {
  const image=req.file.filename

  const sql ="UPDATE restaurant SET image=? ORDER BY r_no DESC LIMIT 1";
  db.query(sql,[image],(err,result)=>{
  //  if(err) return res.json({Message:"Error"});
   // return res.json({Status:"Success"});
  })

  // Save this data to a database probably

  console.log(req.file)
 // res.send({description, imageName})
})


//Create the Records

server.post("/api/restaurants", (req, res) => {

  let details = {
      name: req.body.resName,
      contact_no: req.body.resContactNo,
      address: req.body.resAddress,
      email: req.body.resEmail,
     // image: req.body.resFile,
    };
    let sql = "INSERT INTO restaurant SET ?";
    db.query(sql, details, (error) => {
      if (error) {
        res.send({ status: false, message: "restaurant registration Failed" });
      } else {
        res.send({ status: true, message: "restaurant registered successfully" });
      }
    });
    
  });

  server.post("/api/customers", (req, res) => {

    let details = {
        first_name: req.body.fName,
        last_name: req.body.lName,
        contact_no: req.body.contactNo,
        address: req.body.address
      };
      let sql = "INSERT INTO customer SET ?";
      db.query(sql, details, (error) => {
        if (error) {
          res.send({ status: false, message: "customer registration Failed" });
        } else {
          res.send({ status: true, message: "customer registered successfully" });
        }
      });
      
    });

server.post("/api/users", (req, res) => {
  let details = {
    username: req.body.username,
    password: req.body.pwd,
    usertype: req.body.usertype,
  };
  let sql = "INSERT INTO user SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "restaurant registration Failed" });
    } else {
      res.send({ status: true, message: "restaurant registered successfully" });
    }
  });
    
  });

  server.post("/api/foods", (req, res) => {
  
    let details = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      //image:req.body.image,
      r_id:req.body.r_id
    };
    let sql = "INSERT INTO food SET ?";
    db.query(sql, details, (error) => {
      if (error) {
        res.send({ status: false, message: "food insertion Failed" });
      } else {
        res.send({ status: true, message: "food inserted successfully" });
      }
    });
      
    });

    server.post("/api/cart", (req, res) => {
      let f_id= req.body.f_id;
      let r_id= req.body.r_id;
      let details = {
        f_id: req.body.f_id,
        quantity:req.body.quantity,
        price: req.body.price,
        amount: req.body.amount,
      };
      let sql0 = "SELECT COUNT(*), f.r_id FROM cart AS c INNER JOIN food  AS f ON c.f_id=f.f_id";
      db.query(sql0, (error,result) => {
        if (error) {
          res.send({ status: false, message: "Failed" });
        } else {
          if(result[0].r_id!=r_id)
          {
            let sql2 = "TRUNCATE TABLE cart";
            db.query(sql2, (error) => {
              if (error) {
                //res.send({ status: false, message: "cart Failed" });
              } else {
                //res.send({ status: true, message: "cart successful" });
              }
            });

            let sql3 = "INSERT INTO cart SET ?";
            db.query(sql3, details, (error) => {
              if (error) {
                res.send({ status: false, message: "cart insert Failed" });
              } else {
                res.send({ status: true, message: "cart inserted successfully" });
              }
            });

          }
          else{
            let sql1 = "SELECT COUNT(*) AS c FROM cart WHERE f_id=?";
            db.query(sql1, [f_id], (error,result) => {
              if (error) {
                res.send({ status: false, message: "Failed" });
              } else {
               
                  if(result[0].c>0)
                  {
                   
                      let sql2 = "UPDATE cart SET quantity=quantity+1, amount=amount+price WHERE f_id=?";
                      db.query(sql2, [f_id], (error) => {
                        if (error) {
                          res.send({ status: false, message: "cart update Failed" });
                        } else {
                          res.send({ status: true, message: "cart updated successfully" });
                        }
                      });
                    
                  }
                  else{
                    let sql2 = "INSERT INTO cart SET ?";
                    db.query(sql2, details, (error) => {
                      if (error) {
                        res.send({ status: false, message: "cart insert Failed" });
                      } else {
                        res.send({ status: true, message: "cart inserted successfully" });
                      }
                    });
                  }
                
               
              }
            });
          }
        }
      });

     

      });
  
      server.post("/api/cart_p", (req, res) => {
        let f_id= req.body.f_id;
        let details = {
          f_id: req.body.f_id,
          quantity:req.body.quantity,
          price: req.body.price,
          amount: req.body.amount,
          //image:req.body.image,
          //r_id:req.body.r_id
        };
        let sql1 = "SELECT COUNT(f_id) AS c FROM cart WHERE f_id=?";
        db.query(sql1, [f_id], (error,result) => {
          if (error) {
            res.send({ status: false, message: "Failed" });
          } else {
            if(result[0].c>0)
            {
              let sql2 = "UPDATE cart SET quantity=quantity+1, amount=amount+price WHERE f_id=?";
              db.query(sql2, [f_id], (error) => {
                if (error) {
                  res.send({ status: false, message: "cart update Failed" });
                } else {
                  res.send({ status: true, message: "cart updated successfully" });
                }
              });
            }
          }
        });
  
        });

  server.post("/api/cart_m", (req, res) => {
    let f_id= req.body.f_id;
    let sql = "UPDATE cart SET quantity=quantity-1, amount=amount-price WHERE f_id=?";
    db.query(sql, [f_id], (error) => {
      if (error) {
        res.send({ status: false, message: "cart update Failed" });
      } else {
        res.send({ status: true, message: "cart updated successfully" });
      }
    });

    });

  server.post("/api/login", (req, res) => {

        const username= req.body.username;
        const password= req.body.password;
        const usertype= req.body.usertype;

      let sql = "SELECT * FROM user WHERE username=? AND password = ? AND usertype = ?";
      db.query(sql, [username, password, usertype], (error,result) => {
        if (error) {
          res.send({ status: false, message: "Login failed" });
        } 
        else if(result.length>0){
          res.send({ status: true, message: "User logged in" });
        }else {
          res.send({ status: false, message: "Wrong username or password" });
        }
      });
      
    });

    server.post("/api/orders", (req, res) => {

      const username= req.body.uname;
      const tot_amount= req.body.total_amount;
      var c_id = 0;
      var r_id = 0;
      var o_id=0;
      
      let sql0 = "SELECT c.c_id FROM customer AS c INNER JOIN user AS u ON c.contact_no=u.username WHERE u.username=?";
      db.query(sql0,[username], (error,result0) => {
        if (error) {
         res.send({ status: false, message: "Failed" });
        } else {

          c_id=result0[0].c_id;
          //console.log("c="+c_id); 
          let sql1 = "SELECT r_id FROM food WHERE f_id = (SELECT f_id FROM cart  LIMIT 1)";
          db.query(sql1, (error,result1) => {
            if (error) {
             res.send({ status: false, message: "Failed" });
            } else {

              r_id=result1[0].r_id;
              //console.log("r="+r_id);

              let sql2 = "INSERT INTO orders (c_id, date_time, tot_amount, r_id) VALUES(?,NOW(),?,?)";
              db.query(sql2, [c_id, tot_amount, r_id], (error) => {
                if (error) {
                  res.send({ status: false, message: "failed" });
                }else {
                  let sql3 = "SELECT o_id FROM orders ORDER BY o_id DESC LIMIT 1";
                  db.query(sql3,  (error, result3) =>{
                    if (error) {
                      res.send({ status: false, message: "failed" });
                    } 
                    else{

                      o_id=result3[0].o_id;

                      let sql4 = "INSERT INTO order_desc (o_id,f_id,quantity,unit_price,amount) SELECT '?',f_id,quantity,price,amount FROM cart";
                      db.query(sql4,[o_id],  (error) =>{
                        if (error) {
                          res.send({ status: false, message: "failed" });
                        } 
                      });
                    }
                  });

                  
                }
              });
            }
          });

        }
      });
    
  });

//view the Records

server.get("/api/restaurant", (req, res) => {
    var sql = "SELECT * FROM restaurant ORDER BY name";
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  server.get("/api/cart", (req, res) => {
    var sql = "SELECT * FROM cart AS c INNER JOIN food as f ON c.f_id=f.f_id";
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

 

//Search the Records

  server.get("/api/restaurant/:id", (req, res) => {
    var r_no = req.params.id;
    var sql = "SELECT * FROM restaurant WHERE r_no=" + r_no;
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  server.get("/api/foods/:id", (req, res) => {
    var r_id = req.params.id;
    var sql = "SELECT * FROM food WHERE r_id=" + r_id;
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  server.get("/api/resfoods/:id", (req, res) => {
    var username = req.params.id;
    var sql = "SELECT f.f_id,f.name,f.description,f.price,f.image,r.r_no FROM food as f RIGHT JOIN restaurant as r ON f.r_id=r.r_no WHERE r.contact_no=" + username;
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  server.get("/api/orders/:id", (req, res) => {
    var uname = req.params.id;
    var sql = "SELECT o.o_id,DATE_FORMAT(o.date_time, '%d-%m-%Y %H:%i:%s') as date_time,o.ready,o.tot_amount, c.contact_no,c.address,c.first_name, c.last_name FROM orders as o INNER JOIN restaurant as r ON r.r_no=o.r_id INNER JOIN customer as c ON c.c_id=o.c_id WHERE r.contact_no=? ORDER BY o.date_time DESC";
    db.query(sql, [uname],function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  server.get("/api/order_desc/:id", (req, res) => {
    var uname = req.params.id;
    var sql = "SELECT o.o_id, d.quantity,d.unit_price,d.amount, f.name FROM orders as o INNER JOIN order_desc as d ON o.o_id=d.o_id INNER JOIN restaurant as r ON r.r_no=o.r_id INNER JOIN food as f ON f.f_id=d.f_id WHERE r.contact_no=? ORDER BY o.date_time DESC";
    db.query(sql, [uname],function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

//Update the Records

  server.put("/api/foods/:id", (req, res) => {
    let sql =
      "UPDATE food SET name='" +
      req.body.name +
      "', description='" +
      req.body.description +
      "',price='" +
      req.body.price +
      "'  WHERE f_id=" +
      req.params.id;
  
    let a = db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "Food Update Failed" });
      } else {
        res.send({ status: true, message: "Food Updated successfully" });
      }
    });
  });

  server.put("/api/orders/:id", (req, res) => {
    let sql =
      "UPDATE orders SET ready='" +
      req.body.isChecked +
      "'  WHERE o_id=" +
      req.params.id;
  
    let a = db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "Update Failed" });
      } else {
        res.send({ status: true, message: "Updated successfully" });
      }
    });
  });

  //Delete the Records

  server.delete("/api/foods/:id", (req, res) => {
    let sql = "DELETE FROM food WHERE f_id=" + req.params.id + "";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, message: "Food Deleted Failed" });
      } else {
        res.send({ status: true, message: "Food Deleted successfully" });
      }
    });
  });

  server.delete("/api/cart", (req, res) => {
    let sql = "DELETE FROM cart";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, message: "Cart Deleted Failed" });
      } else {
        res.send({ status: true, message: "Cart Deleted successfully" });
      }
    });
  });