
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://dbuser:Password%40123@cluster0.v7uyu.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema = mongoose.Schema({
    name: String
});

const Items = mongoose.model("item", itemsSchema);

const item1 = new Items({name: "Welcome to your todo list!"});
const item2 = new Items({name: "Hit + button to add a new item!"});
const item3 = new Items({name: "Hit this to delete an item!"});

const defaultItems = [item1,item2,item3];

const listSchema = mongoose.Schema({
    name: String,
    item: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    Items.find({},function(err,fnditems){
  
        if(fnditems.length === 0){
            Items.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Default Items Added");
                }
            })
        
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: "Today", newItem: fnditems});
        }
    })
    
    
})

app.get("/:customListName", function(req, res){

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    item: defaultItems
                });
            
                list.save();

            }else{
                //console.log(foundList);
                res.render("list", {listTitle: foundList.name, newItem: foundList.item});
            }

        }

    })

    

    
})

app.post("/", function(req,res){

    let item = req.body.newItem;
    let listName = _.capitalize(req.body.list);
    
    const newItem = new Items({name:item});

    if (listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){

            foundList.item.push(newItem);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }
      
  
})

app.post("/delete", function(req, res){
    const chkitemId = req.body.chkbox;
    const listName =  req.body.listName;

    if(listName === "Today"){
        Items.findByIdAndRemove(chkitemId, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Deleted");
                res.redirect("/");
            }
        })

    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: chkitemId}}} , function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }

    

})
app.get("/work", function(req,res){

    res.render("list", {listTitle: "Work List", newItem: workItems})
})

app.post("/work", function(req, res){

    
    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");

})

app.get("/about", function(req, res){
    res.render("about");
})
app.listen(3000,function(){
    console.log("Server started on Port 3000 successfully!!");
})