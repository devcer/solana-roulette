const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
  SystemProgram,
} = require("@solana/web3.js");

const figlet = require("figlet");
const chalk = require("chalk");
const inquirer = require("inquirer");

const { getReturnAmount, totalAmtToBePaid, randomNumber } = require("./helper");
const { getWalletBalance, transferSOL, airDropSol } = require("./solana");

const userWallet = Keypair.generate();
const userKeys = userWallet._keypair;

const ownerWallet = Keypair.generate();
const ownerKeys = ownerWallet._keypair;

const stakeQuestions = [
  {
    type: "number",
    name: "stakeAmount",
    message: "What is the amount of SOL you want to stake?",
    default: 0.1,
    validate: function (value) {
      if (isNaN(value) === false && value <= 2) {
        return true;
      }
      return "Please enter a valid number less than 2";
    },
  },
  {
    type: "input",
    name: "stakeRatio",
    message: "What is the ratio of your staking",
    default: "1:1",
    validate: function (value) {
      const ratioArr = value.split(":");
      if (
        ratioArr.length === 2 &&
        ratioArr.every((number) => isNaN(number) === false)
      ) {
        return true;
      }
      return "Please enter a valid ratio";
    },
  },
];

const numberSelectQuestions = [
  {
    type: "number",
    name: "selectedRandomNumber",
    message: "Guess a random number between 1 and 5 (both included)",
    default: 1,
  },
];

async function askQuestions() {
  try {
    const { stakeAmount, stakeRatio } = await inquirer.prompt(stakeQuestions);

    console.log(
      "You will need to pay ",
      chalk.green(stakeAmount),
      " to move forward"
    );

    console.log(
      chalk.green(
        `You will get ${getReturnAmount(
          stakeAmount,
          stakeRatio
        )} if you guess the number correctly`
      )
    );

    const { selectedRandomNumber } = await inquirer.prompt(
      numberSelectQuestions
    );
    console.log("User wallet - ", await getWalletBalance(userKeys.publicKey));
    console.log("Owner wallet - ", await getWalletBalance(ownerKeys.publicKey));

    // console.log(userKeys, " ", walletKeys, " ", stakeAmount);
    const tranferSignature = await transferSOL(
      userKeys,
      ownerKeys,
      stakeAmount
    );

    console.log(
      "Signature of the payment for playing the game ",
      chalk.green(tranferSignature)
    );
    return;
    const generatedRandomNumber = randomNumber(1, 5);
    if (generatedRandomNumber === selectedRandomNumber) {
      console.log(chalk.green(`You guessed is absolutely correct`));
      const returnSignature = await transferSOL(
        ownerKeys,
        userKeys,
        getReturnAmount(stakeAmount, stakeRatio)
      );
      console.log("Here is the price signature ", chalk.green(returnSignature));
    } else {
      console.log(chalk.yellowBright(`Better luck next time`));
    }
  } catch (error) {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  }
}

const gameExecution = async () => {
  await airDropSol(userKeys.publicKey, 2);

  figlet("SOL STAKE", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    console.log(chalk.yellowBright("The max bidding amount is 2.5 SOL here"));
    askQuestions();
  });
};

gameExecution();
