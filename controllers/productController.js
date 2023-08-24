const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
// const slugify = require("slugify");


module.exports.createProduct = async function createProduct(req,res){
    try {
        // if (req.body.title) {
        //   req.body.slug = slugify(req.body.title);
        // }
        const newProduct = await productModel.create(req.body);
        res.json(newProduct);
      } catch (error) {
        res.json({
            message:error.message
        });
      }
}

module.exports.updateProduct = async function updateProduct(req,res){
    const id = req.params._id;
    
    // validateMongoDbId(id);
    try {
    //   if (req.body.title) {
    //     req.body.slug = slugify(req.body.title);
    //   }
    console.log(id,req.body);

    const updateData = await productModel.findOneAndUpdate({id},req.body,{
        new: true,
        });
    
    console.log(updateData);
    res.json({
        message:"data retrive",
        updateData
    });
    
    } catch (error) {
    res.json({
        message:error.message
        })
    }
}



  module.exports.deleteProduct = async function deleteProduct(req,res){
    const id = req.params._id;
    
    try {
      const deleteProduct = await productModel.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
        res.json({
            message:error.message
            })
    }
  }


  module.exports.getProduct = async function getProduct(req,res){
    const id = req.params.id;
    
    try {
      const findProduct = await productModel.findById(id)
      res.json(findProduct);
    } catch (error) {
        res.json({
            message:error.message
            })
    }
  }


  // module.exports.getAllProduct = async function getAllProduct(req,res){
    
  //   try {
   //filtering
  //       const queryObj = {...req.query};
  //       const excludeField = ["page", "sort", "limit", "field"];
  //       excludeField.forEach((el)=>delete queryObj[el]);
  //       let querystr = JSON.stringify(queryObj);
  //       querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  //       let query = productModel.find(JSON.parse(querystr));

//another method of fitering
                            //or
           //const products = await productModel.find(req.query)

                          //or
            // const products = await productModel.find()
      //                 .where("duration")
      //                 .equals(req.query.duration)
      //                 .where("ratings")
      //                 .equals(req.query.ratings)
      

                          //or
// mongoose special method
      // const products = await productModel.find()
      //                 .where("duration")
      //                 .gte(req.query.duration)
      //                 .where("ratings")
      //                 .gte(req.query.ratings)
      //                 .where("price")
      //                 .lte(req.query.price)

      
  //       const product = await query;
  //       res.json(product);

  //   } catch (error) {
  //       res.json({
  //           message:error.message
  //           })
  //   }
  // }



  module.exports.getAllProduct = async function getAllProduct(req,res){
    
    try{
//FILTRING       
      let querystr = JSON.stringify(req.query);
      // g => for global(check complete word not single latter)
      // (\b) => for exact match (check exact word what we written not that word in which present these word)
      querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      const queryObj = JSON.parse(querystr);
      
      //(if we use await here it will give  
      //result not query but sort and other query
      // methods work with query not with result thats why we remove await here.)
      let query = productModel.find(queryObj)
      
//SORT
// use (-) for decending order
//url => (/product/?sort=-price,ratings)
//instead of comma use this (query.sort("price ratings"))

      if(req.query.sort){
        const sortBy = req.quer.sort.split(",").join(" ")
        //console.log(sortBy);
        query = query.sort(sortBy);

      }else{
        query = query.sort("-createdAt");
      }

     

//LIMITING FIELDS
//url => (/product/?fields=name,color,price,ratings)
        if(req.query.fields){
          //query.select("title,color,price,ratings")
          //use (-) for which fiels you do not want to show(product/?feilds=-ratings-color) 
          //NOTE :- (product/?feilds=-ratings-color,title) it will not work this give error, we can not mix include and exclude feilds.
          const fields = req.query.fields.split(",").join(" ");
          query = query.select(fields);
        }else{
          query = query.select("-__v");
        }


//PAGINATION :-
          //url => (/product/?page=2&limit=10)
          //req.query.page*1 :- multiple by 1 convert string to number because req.query.page/limil will return strings.
          const page= req.query.page*1 || 1 ;//(by default page no 1 )
          const limit = req.query.limit*1 || 10;//(by default 10 products show in 1 page)
          //PAGE 1: 1 - 10; PAGE 2: 11 - 20; PAGE 3: 21 - 30
          const skip = (page - 1) * limit
          query = query.skip(skip).limit(limit)

          if(req.query.page){
            const productCount = await productModel.countDocuments();
            if(skip >= productCount){
              throw new Error("This page is not found !")
            }
          }


          const products = await query;
          res.json(products)


    }
    
    catch (error) {
        res.json({
            message:error.message
            })
    }
  }



  //  module.exports.getAllProduct = async function getAllProduct(req,res){
    
  //   try {
  //     const allProduct = await productModel.find()

  //     res.json(allProduct);
  //   } catch (error) {
  //       res.json({
  //           message:error.message
  //           })
  //   }
  // }


module.exports.rating= async function rating (req,res){
    const {_id} = req.user;
    const {star,prodId,comment} = req.body;
    try{
        const product = await productModel.findById(prodId);
        const alreadyRated = await product.ratings.find((userId) => userId.postedby.toString() === _id.toString())
        if(alreadyRated){
            let updateRating = await productModel.updateOne(
              {
                ratings:{
                  $elemMatch:alreadyRated
                },
              },{$set:{
                "ratings.$.star":star,
                "ratings.$.comment":comment
              },
            },
              {new:true}
              )
            
        }else{
            let rateProduct = await productModel.findByIdAndUpdate(
              prodId,{
                $push:{
                  ratings:{
                  star:star,
                  comment:comment,
                  postedby:_id,
            }
          },
        }
            ,{new:true}
            )
          
        }

        const getallrating = await productModel.findById(prodId);
        let totalrating = getallrating.ratings.length;
        let ratingsum = getallrating.ratings
        .map((item)=>item.star)
        .reduce((prev,curr)=> prev+curr,0);
        let actualRating = Math.round(ratingsum / totalrating);

      let finalProduct = await productModel.findByIdAndUpdate(
        prodId,{
          totalrating:actualRating,
        },{
          new:true
        }
        )
        res.json(finalProduct)
      
    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}




  module.exports.addToWishList= async function addToWishList (req,res){
    const {_id} = req.user;
    const {prodId} = req.body;
    
    
    
    try{
        const user = await userModel.findById({_id});
        const alreadyAdded = await user.wishlist.find(({_id}) => _id.toString() === prodId)
        //console.log(alreadyAdded);
        if(alreadyAdded){
            let user = await userModel.findByIdAndUpdate(_id,{$pull:{wishlist:prodId},},{new:true})
            let product = await productModel.findByIdAndUpdate(prodId,{$pull:{wishlist:prodId},},{new:true})
            res.json({
              user
              
            })
        }else{
            let user =  await userModel.findByIdAndUpdate(_id,{$push:{wishlist:prodId},},{new:true})
            //let product = await productModel.findByIdAndUpdate(prodId,{$push:{wishlist:prodId},},{new:true})
            res.json(
              {
                user
                
                
              }
              
            )
            
        }

    }catch(err){
        res.json({
            "message":err.message
            
        })
    }
}