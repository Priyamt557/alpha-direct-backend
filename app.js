var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var agentRouter = require('./routes/searchagent');
var profileRouter = require('./routes/myprofile');
var allmanagersRouter = require('./routes/getmanagers');
var getAllMyAgentsRouter = require('./routes/getAllMyAgents');
var getcomplaintsRouter = require('./routes/getAllComplaints');
var getAgentCommissionRouter = require('./routes/getAgentCommissions');
var getMyPoliciesRouter = require('./routes/getMyPolicies');
var getComplianceRatingRouter = require('./routes/getComplianceRating');
var sendWhatsappMessageRouter = require('./routes/sendWhatsappMessage');
var sendMessageRouter = require('./routes/sendmessage');
var addCustomerComplaintRouter = require('./routes/customer_complaints/addCustomerComplaint');
var editCustomerComplaintRouter = require('./routes/customer_complaints/editCustomerComplaint');



var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/agents-dashboard', usersRouter);
app.use('/search-agent', agentRouter);
app.use('/profile', profileRouter);
app.use('/get-managers', allmanagersRouter);
app.use('/get-all-myagents', getAllMyAgentsRouter);
app.use('/get-my-complaints', getcomplaintsRouter);
app.use('/get-agent-commissions', getAgentCommissionRouter);
app.use('/get-my-policies', getMyPoliciesRouter);
app.use('/get-compliance-rating', getComplianceRatingRouter);
app.use('/send-whatsapp', sendWhatsappMessageRouter);
app.use('/send-message', sendMessageRouter);
app.use('/add-customer-complaint', addCustomerComplaintRouter);
app.use('/edit-customer-complaint', editCustomerComplaintRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
