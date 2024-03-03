const notFound = (req , res , next) => {
  const error  = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
next(error);
}


const errorHandler = (error ,req , res , next) => {
let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
let message = error.message;

if (error.name === "CastError" && error.kind === "ObjectId" ) {
  message = "Resources not found";
  statusCode = 404;
}

if (process.env.NODE_ENV === "development") {
  res.status(statusCode).json({
    message,
     stack : error.stack 
  })
}else {
  res.status(statusCode).json({
    message,
  })
}
}


export {notFound , errorHandler};