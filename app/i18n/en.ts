const en = {
  common: {
    paste: "Paste",
    import: "Import",
    continue: "Continue",
    copy: "Copy",
    copied: "Copied",
    mainWallet: "Main Wallet",
    done: "Done",
    share: "Share",
    max: "Max",
    next: "Next",
    send: "Send",
    from: "From",
    to: "To",
    cancel: "Cancel",
    main: "Main",
  },
  trade: {
    networkFee: "Network Fee",
    maxTotal: "Max Total",
  },
  welcome: {
    createNewWallet: "Create a new wallet",
    importWallet: "I already have a wallet",
  },
  navigators: {
    goBack: "Back",

    screenName: {
      legal: "Legal",
      setupPasscode: "Set Passcode",
      inputPasscode: "Enter Passcode",
      createNewWallet: "Create New Wallet",
      importWallet: "Import",
      home: "Wallet",
      settings: "Settings",
      receive: "Receive",
      send: "Send",
      sendConfirmation: "Confirm",
      buy: "Buy",
      manageWallet: "Wallets",
    },
  },
  legal: {
    message: "Please review the Sparkminds Wallet Terms of Service and Privacy Policy",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  passcode: {
    setupPasscode: {
      step: {
        create: {
          label: "Create Passcode",
        },
        confirm: {
          label: "Confirm Passcode",
        },
      },
      hint: "Adds an extra layer of security when using the app",
    },
    wrongPasscodeMessage: "Wrong passcode, please try again",
  },
  importWallet: {
    hint: "Typically 12 (sometimes 24) words separated by single spaces",
  },
  createNewWallet: {
    generateSecretPhrare: "Your Secret Phrase",
    generateSecretPhrareHint:
      "Write down or copy these words in the right order and save them somewhere safe.",
    verifySecretPhrase: "Verify Secret Phrase",
    verifySecretPhraseHint: "Tap the words to put them next to each other in the correct order.",
    secretSpecialHint:
      "DO NOT  share your phrase to anyone as this gives full access to your wallet!",
  },
  home: {
    actions: {
      send: "Send",
      receive: "Receive",
      buy: "Buy",
      swap: "Swap",
    },
    tabs: {
      token: "Tokens",
      nft: "NFTs",
    },
  },
  sendResult: {
    information: {
      title: "Send {{token}} successfully",
      token: "Token",
      value: "Value",
      to: "To address",
      txnFee: "Transaction fee",
      txnHash: "Transaction hash",
      confirmations: "Confirmations",
    },
  },
  settings: {
    wallets: "Wallets",
  },
  input: {
    walletName: {
      label: "Name",
      placeholder: "Please enter name of wallet",
    },
    secretPhrase: {
      label: "Secret Phrase",
      placeholder: "Secret Phrase",
    },
    search: {
      placeholder: "Search here...",
    },
    recipientAddress: {
      label: "Recipient Address",
      placeholder: "Enter your recipient address",
    },
    amount: {
      label: "Amount",
      placeholder: "0.00",
    },
  },
  errorMessage: {
    required: "{{fieldName}} is required",
    invalid: "Invalid {{fieldName}}",
    unknown: "Something went wrong. Please try again.",
    mnemonicWrongOrder: "Invalid order. Try again!",
  },
}

export default en
export type Translations = typeof en
