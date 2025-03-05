# Expense-Tracker-full

The application is deployed on my AWS EC2 instance and can be accessed from ->(Login HERE) [trackMyExpense](https://trackmyexpense.site/)

This is an Expense Tracker App that allows you to track your expenses and manage your finances.

## Features
- SignUp and Login to your account to have all your data saved.
- Reset Password in case you forget your passwords.
- Add expenses with amount, description, and type.
- View expenses in real-time as a list.
- Edit any expense in the list.
- Delete any expense from the list.

## Premium Features

Upgrade to the premium version to unlock additional powerful features:

### 1. Advanced Reporting
Gain deeper insights into your spending habits with comprehensive reports. Track trends, analyze categories, and make informed financial decisions.

### 3. User Leaderboard
Manage expenses using our leaderboard feature which shows where you stand amid all our users.

### 4. Securely Download Reports
Rest easy knowing your financial data is can be easily downloaded. Retrieve your information anytime, anywhere.

To unlock these premium features, and subscribe to a premium plan.

## Technologies Used

- FrontEnd: HTML CSS, JavaScript
- BackEnd: Node.js/Express.js, MySQL
- Session Authentication: JWT(Json Web Tokens)

## Integrations Used
- Mailing Service Provider: Brevo
- Payment Service Provider: RazorPay

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up the MySQL database and configure the connection.
4. Create a .env file in main folder, with following attributes(these attributes are used in our code for multpile reasons including connection to DB, Payement Gateway and PORT):
   <br>a. TOKEN_SECRET
   <br>b. PORT
   <br>c. RZP_KEY_ID
   <br>d. RZP_KEY_SECRET
   <br>e. BREVO_API_KEY
   <br>f. IAM_USER_KEY
   <br>g. IAM_USER_SECRET
   <br>h. DB_PASS
   <br>i. DB_NAME
   <br>j. DB_USERNAME
   <br>k. DB_HOST
6. Run the application with `npm start`.
7. Access the app at `http://localhost:<process.env.PORT>`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
