const Sequelize = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/expense');
const Reports = require('../models/report');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const moment = require('moment');

let currentDt = new Date().getDate();
let currentMnth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

exports.getLeaderBoard = async (req, res) => {
    try {
        // Fetch all users id,Name and their total expenses
        const users = await User.findAll({
            attributes: [
                'id',
                'Name',
                [Sequelize.fn('SUM', Sequelize.col('expenses.Amount')), 'totalExpenses']
            ],
            include: [
                {
                    model: Expense,
                    as: 'expenses', // Alias for the Expense model
                    attributes: [],
                },
            ],
            group: ['user.id'], // Group by userId to calculate total expenses per user
            order: [[Sequelize.literal('totalExpenses'), 'DESC']] // Order by total expenses in descending order
        })
        return res.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ sucess: false, error: new Error(err) });
    }
}

exports.getReports = async (req, res) => {
    try {
        const reports = await UserServices.getReports(req);
        res.status(200).send(reports);
    }
    catch (err) {
        res.send(err);
    }
}


exports.downloadReport = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        let expenseCSV = "ExpenseId,Amount,Description,Category,Date\n";
        expenses.forEach(expense => {
            expenseCSV +=expense.id+","+expense.Amount+","+expense.Description+","+expense.Category+","+expense.createdAt+"\n"
        });
        const userID = req.user.id;
        const fileName = `ExpensesLOCAL${userID}/${new Date()}.csv`;
        const fileURL = await S3Services.uploadToS3(expenseCSV, fileName);
        const downloadedReportsTableInsert = await req.user.createReport({ url: fileURL });
        res.status(200).send({ fileURL, createdAt: downloadedReportsTableInsert.createdAt, sucess: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err });
    }
}

exports.getReportTable = async (req, res) => {
    try {
        const type = req.params.type;
        const expenses = await UserServices.getExpenses(req);   //Current users ALL expenses
        let expArr = [];
        let totalExp = 0;

        expenses.forEach(expense => {
            //Finding date month and year
            let dt = moment(expense.createdAt).date();
            let mnth = moment(expense.createdAt).month() + 1;
            let year = moment(expense.createdAt).year();

            let expOp;
            if (type.toUpperCase() === "D") {
                if (year == currentYear && mnth == currentMnth && dt == currentDt) {
                    totalExp += parseInt(expense.Amount);
                    expOp = { Amount: expense.Amount, Description: expense.Description, Category: expense.Category, Date: moment(expense.createdAt).format("DD/MM/YYYY") }
                    expArr.push(expOp);
                }
            }
            else if (type.toUpperCase() === "W") {
                if (isFromCurrentMonth(mnth, year)) {
                    if (isFromCurrentWeek(dt, mnth, year)) {
                        totalExp += parseInt(expense.Amount);
                        expOp = { Amount: expense.Amount, Date: moment(expense.createdAt).format("DD/MM/YYYY") }
                        expArr.push(expOp);
                    }
                }
            }
            else if (type.toUpperCase() === "M") {
                if (isFromCurrentMonth(mnth, year)) {
                    totalExp += parseInt(expense.Amount);
                    expOp = { Amount: expense.Amount, Date: moment(expense.createdAt).format("DD/MM/YYYY") }
                    expArr.push(expOp);
                }
                }
            })

        res.status(200).send({ sucess: true, result: { expArr, totalExp }, message: "Expenses Fetched Sucessfully" });
    }
    catch (err) {
        console.log(err);
    }
}

//NOTE: to check last 7 days expenses
function isFromCurrentWeek(date, month, year) {
    //first day of week => Day1 of 7 days, if today is 7th Day
    const firstDayOfWeek = new Date(currentYear, currentMnth - 1, currentDt - 6);
    if (year == currentYear) {
        //if last month date needed
        if (month == currentMnth) {
            if (date <= currentDt)
                return true;
        }
        else if (firstDayOfWeek.getDate() > currentDt) {
            if (date >= firstDayOfWeek.getDate())
                return true;
        }
    }
    return false;
}

//NOTE: to check last 30 days expenses
function isFromCurrentMonth(month, year) {
    //First day in last 30 days report
    const firstDayOfMonth = new Date(currentYear, currentMnth - 1, currentDt - 29);
    if (year == currentYear) {
        if (month == currentMnth || month == firstDayOfMonth.getMonth() + 1)
            return true;
    }
    else if (year == firstDayOfMonth.getFullYear() && (month == firstDayOfMonth.getMonth() + 1))
        return true;

    return false;
}