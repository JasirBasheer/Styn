const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Coupon = require("../models/couponModel");
const { ObjectId } = require("mongodb");
const moment = require('moment');
const session = require("express-session");
const { create } = require("../models/userModel");
const PDFDocument = require('pdfkit');
const Razorpay = require('razorpay');
let instance = new Razorpay({
  key_id: process.env.RAZORPAYID,
  key_secret: process.env.RAZORPAYSECRET,
});

const loadAddAddress = async(req,res,next)=>{
  try {
    const categories = await Category.find({block:false});  
    res.render('users/addcheckoutaddress',{categories:categories});
  } catch (error) {
      next(error);
  }
}
const addAddress = async(req,res,next)=>{
  try {
    const address = await User.findByIdAndUpdate({
      _id:req.session.userData._id
    },{
      $addToSet:{
        address:req.body
      }
    })
    res.redirect('/checkout');
  } catch (error) {
      next(error);
  }
}
const loadEditAddress = async(req,res,next)=>{
  try {
    const id = req.query.id;    
    const userAddress = await User.findOne({address:{$elemMatch:{_id:id}}},{"address.$":1,_id:0}); 
    const categories = await Category.find({block:false});
    res.render('users/editcheckoutaddress',{address:userAddress,categories:categories});
  } catch (error) {
      next(error);
  }
}
const editAddress = async(req,res,next)=>{
  try {
    const id = req.query.id;
    const userAddress = await User.updateOne(
      {address:{$elemMatch:{_id:id}}},
      {$set:{"address.$" :req.body}}); 
      res.redirect('/checkout');
  } catch (error) {
    next(error);
  } 
}
const deleteAddress = async(req,res,next)=>{
  try {
    const id = req.query.id;
    const userAddress = await User.findByIdAndUpdate(
      {_id:req.session.userData._id},
      {$pull:{address:{_id:id}}}
    );
    res.redirect('/checkout');
  } catch (error) {
    next(error);
  }
}

const loadCheckout = async(req,res,next)=>{
  try {    
    const categories = await Category.find({block:false});
    const userData = req.session.userData;
    const user = await User.findOne({_id:userData._id});
    const cartId = await Cart.findOne({userId:userData._id}).populate('couponId');  

    if(cartId){   
      if(cartId.isCouponApplied){
        const pipeline = [
          { $match: { userId:new ObjectId(req.session.userData._id) } },
          { $unwind: "$products" },
          {
            $project: {
              product: "$products.productId",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "items",
            },
          },
        ];
        const findProducts = await Cart.aggregate(pipeline);
        const totalPipeline = [
          ...pipeline,
          {
            $project: {
              total: {
                $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
              },
            },
          },
        ];
        const productTotalPrice = await Cart.aggregate(totalPipeline); 
        const groupTotalPipeline = [
          ...pipeline,
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
                },
              },
            },
          },
        ];
        const subTotalPrice = await Cart.aggregate(groupTotalPipeline);   
         
        const maxTotalPrice = cartId.couponId.maximum; 
        let discount; 
        if(subTotalPrice[0].total<=maxTotalPrice){
          discount = (subTotalPrice[0].total* cartId.couponId.percentage)/100; 
        }
        else{
            discount = (maxTotalPrice* cartId.couponId.percentage)/100;
        } 
        const totalAfterDiscount = subTotalPrice[0].total - discount;

        res.render('users/checkout',{
          categories:categories, 
          address:user.address,
          products:findProducts,
          productTotalPrice,
          subTotalPrice,
          discount,totalAfterDiscount,
          cartId,user
        });        
      } 
      else{             
        const pipeline = [
          { $match: { userId:new ObjectId(req.session.userData._id) } },
          { $unwind: "$products" },
          {
            $project: {
              product: "$products.productId",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "items",
            },
          },
        ];
        const findProducts = await Cart.aggregate(pipeline);

        const totalPipeline = [
          ...pipeline,
          {
            $project: {
              total: {
                $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
              },
            },
          },
        ];
        const productTotalPrice = await Cart.aggregate(totalPipeline);    

        const groupTotalPipeline = [
          ...pipeline,
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
                },
              },
            },
          },
        ];
        const totalPrice = await Cart.aggregate(groupTotalPipeline); 
        
        res.render('users/checkout',{
          categories:categories, 
          address:user.address,
          products:findProducts,
          productTotalPrice,
          totalPrice,
          cartId,user         
        });               
      }
    }
    else{
      res.redirect('/cart');
    } 
  } catch (error) {
    next(error);
  }
}

const createOrder = async(req,res,next)=>{
  try {
    let balanceAmount = 0;
    let newOrder,createOrder;
    const {payment} = req.body;
    const userData = req.session.userData; 
    const user = await User.findOne({_id:userData._id}); 
    const cart = await Cart.findOne({userId:userData._id}).populate('couponId');   
    
    if(cart.isCouponApplied){
      const pipeline = [
        { $match: {userId:new ObjectId(req.session.userData._id)}},
        { $unwind: "$products"},
        {
          $project: {
            product: "$products.productId",
            quantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "items"
          },          
        }
      ];
      const findProducts = await Cart.aggregate(pipeline);
      const totalPipeline = [
        ...pipeline,
        {
          $project: {
            total: {
              $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
            },
          },
        },
      ];
      const productTotalPrice = await Cart.aggregate(totalPipeline);
      const groupTotalPipeline = [
        ...pipeline,
        {
          $group: {
            _id:null,
            total: {
              $sum: {
                $multiply: ["$quantity",{$arrayElemAt: ["$items.price",0]}]
              }
            }
          }
        }
      ]; 
      const subTotalPrice = await Cart.aggregate(groupTotalPipeline);      
   
      const maxTotalPrice = cart.couponId.maximum; 
      let discount; 
      if(subTotalPrice[0].total<=maxTotalPrice){
         discount = (subTotalPrice[0].total* cart.couponId.percentage)/100; 
      }
      else{
          discount = (maxTotalPrice* cart.couponId.percentage)/100;
      }        
      const totalAfterDiscount = subTotalPrice[0].total - discount;

      const walletCheckbox = req.body.walletCheckbox; 
      const walletBalance = user.wallet;
      const walletAmountUsed = Math.min(totalAfterDiscount, walletBalance);
      balanceAmount = totalAfterDiscount - walletAmountUsed;   

      if(walletCheckbox === '1'){
        if(balanceAmount){
          newOrder = new Order({
            customer:req.session.userData._id,
            address:req.body.address,
            items:findProducts,
            totalPrice:totalAfterDiscount,
            isWalletApplied:true,
            balanceTotal:balanceAmount,
            payment:req.body.payment,
            createdAt: new Date(),
            couponId:cart.couponId,
            isCouponApplied:true
          }); 
         createOrder = await newOrder.save();            
         await User.updateOne(
            {_id:req.session.userData._id},
            {$inc:{wallet:-walletAmountUsed}}
          )
        }else{
          newOrder = new Order({
            customer:req.session.userData._id,
            address:req.body.address,
            items:findProducts,
            totalPrice:totalAfterDiscount,
            isWalletApplied:true,
            balanceTotal:balanceAmount,
            payment:'wallet',
            createdAt: new Date(),
            couponId:cart.couponId,
            isCouponApplied:true
          }); 
         createOrder = await newOrder.save();            
         await User.updateOne(
            {_id:req.session.userData._id},
            {$inc:{wallet:-walletAmountUsed}}
          )
        }
      }
      else{
        newOrder = new Order({
          customer:req.session.userData._id,
          address:req.body.address,
          items:findProducts,
          totalPrice:totalAfterDiscount,
          isWalletApplied:false,
          payment:req.body.payment,
          createdAt: new Date(),
          couponId:cart.couponId,
          isCouponApplied:true
        });
        createOrder = await newOrder.save();
      }
      
      if(createOrder){
        for(let i=0;i<findProducts.length;i++){
          const productId = findProducts[i].product;
          const quantityPurchased = findProducts[i].quantity;
          await Product.updateOne(
            {_id: new ObjectId(productId)},
            {$inc:{noOfStocks:-quantityPurchased}}
          )
        }
      }
      const deleteCart = await Cart.findOneAndDelete({userId:req.session.userData._id});    

      if(createOrder.payment === 'COD' || createOrder.payment === 'wallet'){
        res.redirect(`/orderconfirmation?id=${createOrder._id}`);
      }       
      else{
        res.status(200).json({redirectUrl:`/orderconfirmation?id=${createOrder._id}`});
      }
    }
    else{
      const pipeline = [
        { $match: { userId:new ObjectId(req.session.userData._id) } },
        { $unwind: "$products" },
        {
          $project: {
            product: "$products.productId",
            quantity: "$products.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "items",
          },
        },
      ];
      const findProducts = await Cart.aggregate(pipeline);
      const groupTotalPipeline = [
        ...pipeline,
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ["$quantity", { $arrayElemAt: ["$items.price", 0] }],
              },
            },
          },
        },
      ];
      const totalPrice = await Cart.aggregate(groupTotalPipeline); 
      
        const walletCheckbox = req.body.walletCheckbox;        

        const walletBalance = user.wallet;
        const walletAmountUsed = Math.min(totalPrice[0].total, walletBalance);
        balanceAmount = totalPrice[0].total - walletAmountUsed;   

        if(walletCheckbox === '1'){
          if(balanceAmount){
            newOrder = new Order({
              customer:req.session.userData._id,
              address:req.body.address,
              items:findProducts,
              totalPrice:totalPrice[0].total,
              isWalletApplied:true,
              balanceTotal:balanceAmount,
              payment:req.body.payment,
              createdAt: new Date()
            }); 
           createOrder = await newOrder.save();            
           await User.updateOne(
              {_id:req.session.userData._id},
              {$inc:{wallet:-walletAmountUsed}}
            )
          }else{
            newOrder = new Order({
              customer:req.session.userData._id,
              address:req.body.address,
              items:findProducts,
              totalPrice:totalPrice[0].total,
              isWalletApplied:true,
              balanceTotal:balanceAmount,
              payment:'wallet',
              createdAt: new Date()
            }); 
           createOrder = await newOrder.save();            
           await User.updateOne(
              {_id:req.session.userData._id},
              {$inc:{wallet:-walletAmountUsed}}
            )
          }
        }
        else{
          newOrder = new Order({
            customer:req.session.userData._id,
            address:req.body.address,
            items:findProducts,
            totalPrice:totalPrice[0].total,
            isWalletApplied:false,
            payment:req.body.payment,
            createdAt: new Date()
          });
          createOrder = await newOrder.save();
        }
        
        if(createOrder){
          for(let i=0;i<findProducts.length;i++){
            const productId = findProducts[i].product;
            const quantityPurchased = findProducts[i].quantity;
            await Product.updateOne(
              {_id: new ObjectId(productId)},
              {$inc:{noOfStocks:-quantityPurchased}}
            )
          }
        }
       
      const deleteCart = await Cart.findOneAndDelete({userId:req.session.userData._id});  
      if(createOrder.payment === 'COD' || createOrder.payment === 'wallet'){
        res.redirect(`/orderconfirmation?id=${createOrder._id}`);
      }       
      else{
        res.status(200).json({redirectUrl:`/orderconfirmation?id=${createOrder._id}`});
      }
    }   
  } catch (error) {
    next(error);
  }
}

const loadOrderConfirmation = async(req,res,next)=>{
  try {
    res.render('users/orderconfirmation');
  } catch (error) {
    next(error);
  }
}
const loadOrders = async(req,res,next)=>{
  try {
    let orders = await Order.find({customer:req.session.userData._id}).sort({_id:-1});
    const categories = await Category.find({block:false});

    orders = orders.map(orders => ({
      ...orders.toObject(),
      orderDate: moment(orders.createdAt).format('DD/MM/YYYY')
    }));

    res.render('users/orders',{orders,categories,moment});
  } catch (error) {
    next(error);
  }
}

const loadOrderDetails = async(req,res,next)=>{
  try {
    const orderId = req.query.id;
    let orderDetails = await Order.find({_id:orderId})     
    orderDetails = orderDetails.map(orders => ({
      ...orders.toObject(),
      orderDate: moment(orders.createdAt).format('DD/MM/YYYY')
    }));
    res.render('users/orderdetails',{order:orderDetails,moment});
  } catch (error) {
    next(error);
  }
}

const downloadInvoice = async(req,res,next)=>{
  try {
    const orderId = req.query.id;
    const order = await Order.findOne({_id:orderId});
    
    if(!order){
      res.status(404).send('Order not found');
    }
    //create new pdf document
    const doc = new PDFDocument({font:'Times-Roman'});

    //set the response header for downloading
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachement;filename="invoice-${order._id}.pdf"`);
    doc.pipe(res);

    //add the order details to the pdf
    doc.fontSize(18).text(`SPY.STEPS INVOICE`,{ align: 'center' })
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(16).text(`Order Summary - Order ID: ${order._id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Product Name', { width: 200, continued: true });
    doc.fontSize(12).text('Price', { width: 100, align: 'center', continued: true });
    doc.fontSize(12).text('Qty', { width: 50, align: 'right' });
    doc.moveDown();

    let totalPrice = 0;
    order.items.forEach((items, index) => {
      doc.fontSize(12).text(`${index + 1}. ${items.items[0].name}`, { width: 200, continued: true });
      const totalCost = items.items[0].price * items.quantity;
      doc.fontSize(12).text(`${totalCost}`, { width: 100, align: 'center', continued: true });
    
      doc.fontSize(12).text(`${items.quantity}`, { width: 50, align: 'right' });
      doc.moveDown();
      totalPrice += totalCost;
    });

    doc.moveDown();
    doc.fontSize(12).text(`Subtotal: ${totalPrice}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`Total Amount with discount: ${order.totalPrice}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`Ordered Date: ${order.createdAt}`);
    doc.moveDown();
    doc.fontSize(12).text(`Payment Method: ${order.payment === 'COD' ? 'Cash on Delivery' : order.payment === 'wallet' ? 'Wallet' : 'Razor Pay'}`);
    doc.moveDown();
    doc.fontSize(12).text(`Shipping Address: ${order.address}`)
    doc.moveDown();
    //doc.fontSize(12).text(`Order Status: ${order.orderStatus}`);

    // Add a "Thank you" message at the end of the invoice
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(14).text('Thank you for shopping with us!', { align: 'center' });

    // End the PDF document
    doc.end();
  } catch (error) {
    next(error);
  }
}
const cancelOrder = async(req,res,next)=>{
  try {    
    const {orderId} = req.body;    
    const orderCancel = await Order.findByIdAndUpdate(
      {_id:orderId},
      {$set:{orderStatus:'Cancelled'}},
      {new: true}
    )  
    if(orderCancel){
      res.json(orderCancel);
      const {items} = orderCancel;
      items.forEach(async(item)=>{
        const {product : productId, quantity} = item;
        await Product.updateOne(
          {_id:productId},
          {$inc:{noOfStocks:quantity}}
        );        
      })
      if(orderCancel.payment!=='COD'){
        await User.updateOne(
          {_id:req.session.userData},
          {$inc:{wallet:req.body.orderValue}}            
        )
      }
      else{
        if(orderCancel.isWalletApplied){
          const walletAmount = orderCancel.totalPrice-orderCancel.balanceTotal;
          await User.updateOne(
            {_id:req.session.userData},
            {$inc:{wallet:walletAmount}}
          )
        }
      }
    }    
  } catch (error) {
    next(error);
  }
}
const returnOrder = async(req,res,next)=>{
  try {
    const {orderId} = req.body;     
    const order = await Order.findById({_id:orderId}); 
    const deliveryDate = order.deliveryDate; 
    const after10Days = moment(deliveryDate, 'DD.MM.YYYY HH:mm').add(10, 'd').toISOString(); 
    const today = moment().toISOString();     
    const todayMoment = moment(today);
    if (todayMoment.isBefore(after10Days)) {      
      const orderReturn = await Order.findByIdAndUpdate(
        {_id:orderId},
        {$set:{orderStatus:'Returned'}},
        {new: true}
      )
      if(orderReturn){
        res.json(orderReturn);
        const {items} = orderReturn;
        items.forEach(async(item)=>{
          const {product : productId, quantity} = item;
          await Product.updateOne(
            {_id:productId},
            {$inc:{noOfStocks:quantity}}
          );          
        })
        await User.updateOne(
          {_id:req.session.userData._id},
          {$inc:{wallet:req.body.orderValue}}
        )
      }
    } else {      
      res.json({message:'Item can not be returned'});
    }      
    
  } catch (error) {
    next(error);
  }
}

const applyCoupon = async(req,res,next)=>{
  try {
    let coupon;
    const couponMinValue = await Coupon.findOne({couponName:req.body.couponName}); 
    const cart = await Cart.findOne({_id:req.body.cartId}).populate('couponId'); 
    
    const totalPrice = req.body.totalPrice;   
    let minTotalPrice = couponMinValue.minimum; 
    if(totalPrice>=minTotalPrice){
      coupon = await Coupon.findOne({couponName:req.body.couponName});
    }
    else{
      console.log(`coupon valid only above the purchas of ${minTotalPrice}`);
      return res.json({message:`coupon valid only above the purchas of ${minTotalPrice}`});
    }    
    const today = moment().toISOString();
    if(cart.isCouponApplied){
      console.log(`Coupon Already Applied ${cart.couponId.couponName}`);
      res.json({message:`Coupon Already Applied ${cart.couponId.couponName}`});
    }
    else{
      if(coupon){
        if(coupon.isActive && moment(coupon.expiryDate).isAfter(today)){
          if(coupon.userId.includes(req.session.userData._id)){
            console.log('User Already Used the Coupon');
            res.json('User Already Used the Coupon');
          }
          else{
            const updateCouponInCart = await Cart.findByIdAndUpdate(
              {_id:req.body.cartId},
              {$set:{
                couponId:coupon._id,
                isCouponApplied:true
              }}
            );
            const updateUserInCoupon = await Coupon.updateOne(
              {_id:coupon._id},
              {$push:{userId:req.session.userData._id}}
            );
            if(updateCouponInCart && updateUserInCoupon){
              res.json('success');
            }
          }
        }else{
          console.log('Coupon Expired. Expiry Date:',coupon.expiryDate,'Current moment:',today);
          res.json('Coupon Expired');
        }
      }
      else{
        console.log('Invalid Coupon');
        res.json('Invalid Coupon');
      }
    }
  } catch (error) {
    next(error);
    res.json({message:'Coupon Could not be applied'});
  }
}

const removeCoupon = async(req,res,next)=>{
  try {
    const cart = await Cart.findOne({userId:req.session.userData._id});
    const removeIdFromCoupon = await Coupon.updateOne(
      {_id:cart.couponId},
      {$pull:{userId:req.session.userData._id}}
    );
    const updateCouponAppliled = await Cart.findByIdAndUpdate(
      {_id:req.body.cartId},
      {
        isCouponApplied:false,
        $unset:{couponId:cart.couponId}
      }
    );
    if(removeIdFromCoupon && updateCouponAppliled){
      res.json('success');
    }
  } catch (error) {
    next(error);
  }
}


const razorPayFunction = async(req,res)=>{
  console.log("create orderId request",req.body);
  let options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "rcp1"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send({orderId : order.id});
  });
};

const razorPayOrder = async(req,res)=>{
  let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id; 
   let crypto = require("crypto");
   let expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAYSECRET)
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.response.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   let response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
       res.send(response);
       console.log('Payment processed');
}; 


module.exports={
  loadCheckout,
  loadAddAddress,
  addAddress,
  loadEditAddress,
  editAddress,deleteAddress,
  createOrder,
  loadOrderConfirmation,
  loadOrders,
  loadOrderDetails,downloadInvoice,
  cancelOrder,returnOrder,
  applyCoupon,removeCoupon,
  razorPayFunction,razorPayOrder
}